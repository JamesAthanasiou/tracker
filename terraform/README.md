# Tracker — Terraform Infrastructure

Provisions the full AWS stack for the tracker app on a single `t3.nano` EC2 instance.

## What gets created

| Resource | Details |
|---|---|
| EC2 instance | Amazon Linux 2023, t3.nano |
| Elastic IP | Static public IP attached to the instance |
| Security group | Ports 22, 80, 443 open |
| Key pair | RSA key generated and saved as `tracker-prod.pem` |
| S3 bucket | Private — serves the frontend via nginx proxy |
| VPC Gateway Endpoint | Free private route from EC2 to S3 |
| Route 53 A records | `jamesisonline.com` + `api.jamesisonline.com` |

On first boot the EC2 instance runs `user_data.sh.tpl` which installs Docker and docker-compose, clones the repo, writes the `.env` file, bootstraps SSL, and starts the full stack automatically.

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) installed locally
- AWS CLI configured locally — verify with:
  ```bash
  aws sts get-caller-identity
  ```
  If it errors, run `aws configure` with your IAM access key and secret.
- Node and yarn installed locally — required for the initial frontend build on `apply`:
  ```bash
  brew install node
  npm install -g yarn
  ```

---

## Setup

```bash
cd terraform

cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and fill in:
- `db_password` — use a strong password
- Any additional backend secrets (JWT keys, API keys, etc.) your `backend/.env` requires — add them as new variables in `variables.tf` and reference them in `user_data.sh.tpl`

Then:

```bash
terraform init    # downloads providers (one-time)
terraform plan    # preview what will be created
terraform apply   # build everything (~2 min)
```

Type `yes` when prompted. Terraform will:
1. Create all AWS infrastructure
2. Build and sync the frontend to S3
3. Boot the EC2 instance — installs Docker, clones the repo, bootstraps SSL, starts the stack

The server takes ~3 minutes to finish booting. By the time it's done, the site should be live at `https://jamesisonline.com`.

---

## After apply

**Update GitHub Secrets** in the tracker repo (`Settings → Secrets → Actions`) so future deploys reach the new server:
- `EC2_IP` — printed in Terraform output
- `EC2_KEY_PERM` — full contents of `terraform/tracker-prod.pem`

---

## Tearing down

To destroy all Terraform-managed resources:

```bash
aws s3 rm s3://jamesisonline --recursive
terraform destroy
```

The S3 bucket must be emptied first — Terraform cannot delete a non-empty bucket. The two commands above handle that in order.

This removes the EC2 instance, Elastic IP, security group, key pair, S3 bucket, VPC endpoint, and Route 53 A records. The hosted zone NS and SOA records are not touched.

---

## Deploying after rebuild

**Backend** — fully automatic. Push to `main` and GitHub Actions builds the Docker image, pushes to Docker Hub, and restarts the containers on EC2. No manual steps needed.

**Frontend** — manual. There is no CI/CD for the frontend. Build and sync to S3 from the `tracker_client` repo whenever you have changes:
```bash
cd ../tracker_client
yarn build
aws s3 sync ./dist s3://jamesisonline --delete
```

Terraform also runs this automatically on `apply` (initial setup only).

---

## Files

| File | Purpose |
|---|---|
| `main.tf` | AWS provider, looks up default VPC, Route 53 zone, latest AL2023 AMI |
| `variables.tf` | All configurable inputs |
| `keypair.tf` | Generates RSA key pair, saves `.pem` locally |
| `ec2.tf` | Security group, EC2 instance, Elastic IP |
| `s3.tf` | S3 bucket, public access block, VPC Gateway Endpoint, bucket policy |
| `dns.tf` | Route 53 A records |
| `frontend.tf` | Builds tracker-client and syncs to S3 on apply |
| `outputs.tf` | Prints IP, SSH command, GitHub Secrets to update |
| `user_data.sh.tpl` | EC2 boot script — installs Docker, clones repo, bootstraps SSL, starts stack |
| `terraform.tfvars.example` | Template for secrets — copy to `terraform.tfvars` |

> `terraform.tfvars`, `*.pem`, and Terraform state files are gitignored.
