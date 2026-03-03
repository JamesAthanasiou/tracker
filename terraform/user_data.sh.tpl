#!/bin/bash
set -ex

# Log all output for debugging: sudo cat /var/log/user-data.log
exec > >(tee /var/log/user-data.log | logger -t user-data) 2>&1

# ── 1. Install system dependencies ──────────────────────────────────────────
dnf update -y
dnf install -y docker git

systemctl enable docker
systemctl start docker

# Install docker-compose standalone binary (v2, named docker-compose for
# compatibility with compose.yml scripts and GitHub Actions workflow)
curl -SL "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add ec2-user to docker group (applies to SSH sessions after this boot)
usermod -aG docker ec2-user

# ── 2. Clone the repo ────────────────────────────────────────────────────────
# If the repo is private, add a GitHub token or deploy key here.
git clone https://github.com/jamesathanasiou/tracker.git /home/ec2-user/tracker
chown -R ec2-user:ec2-user /home/ec2-user/tracker

# ── 3. Write .env file ───────────────────────────────────────────────────────
# If the backend requires additional secrets (JWT keys, API keys, etc.),
# add them here and to variables.tf / terraform.tfvars.
cat > /home/ec2-user/tracker/.env << ENVEOF
APP_PORT=${app_port}
DB_NAME=${db_name}
DB_HOST=db
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_PORT=${db_port}
ENVEOF
chown ec2-user:ec2-user /home/ec2-user/tracker/.env

# ── 4. Build local images (db, number-service) ───────────────────────────────
cd /home/ec2-user/tracker
docker-compose -f compose.yml --env-file .env build

%{ if environment == "prod" ~}
# ── 5. PROD: Bootstrap SSL then start full stack ─────────────────────────────
# DNS records were created by Terraform before this instance. Route 53
# typically propagates in under 60 seconds, and by the time packages install
# and images build above, DNS should be ready for ACME validation.
bash certbot/scripts/init-letsencrypt.sh

# init-letsencrypt.sh starts nginx only. Bring up the rest of the stack.
docker-compose -f compose.yml --env-file .env up -d

%{ else ~}
# ── 5. TEST: Create dummy certs and start the stack ──────────────────────────
# DNS is NOT pointed at this server, so Let's Encrypt validation would fail.
# We create a self-signed cert so nginx can start. SSL won't be trusted by
# browsers but everything else (backend, db, number-service) will work.
DOMAIN="jamesisonline.com"
DATA_PATH="/home/ec2-user/tracker/certbot"

mkdir -p "$$DATA_PATH/conf/live/$$DOMAIN" "$$DATA_PATH/www"

# Download nginx TLS params that the nginx config expects
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
  > "$$DATA_PATH/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
  > "$$DATA_PATH/conf/ssl-dhparams.pem"

# Self-signed cert
openssl req -x509 -nodes -newkey rsa:4096 -days 365 \
  -keyout "$$DATA_PATH/conf/live/$$DOMAIN/privkey.pem" \
  -out    "$$DATA_PATH/conf/live/$$DOMAIN/fullchain.pem" \
  -subj   "/CN=localhost"

chown -R ec2-user:ec2-user "$$DATA_PATH"

docker-compose -f compose.yml --env-file .env up -d
%{ endif ~}
