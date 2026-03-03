resource "tls_private_key" "tracker" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "tracker" {
  key_name   = "tracker-${var.environment}"
  public_key = tls_private_key.tracker.public_key_openssh
}

# Saves the .pem file locally in the terraform/ directory.
# The .gitignore in this directory excludes *.pem files.
resource "local_file" "private_key" {
  content         = tls_private_key.tracker.private_key_pem
  filename        = "${path.module}/tracker-${var.environment}.pem"
  file_permission = "0400"
}
