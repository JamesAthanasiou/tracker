output "elastic_ip" {
  description = "Public IP of the new EC2 instance"
  value       = aws_eip.tracker.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${path.module}/tracker-${var.environment}.pem ec2-user@${aws_eip.tracker.public_ip}"
}

output "github_secrets_to_update" {
  description = "Update these two GitHub Secrets in your tracker repo after apply"
  value = <<-EOT

    Go to: https://github.com/jamesathanasiou/tracker/settings/secrets/actions

    EC2_IP      = ${aws_eip.tracker.public_ip}
    EC2_KEY_PERM = (paste the full contents of terraform/tracker-${var.environment}.pem)

  EOT
}

locals {
  next_step_prod = <<-EOT

    The server is booting at ${aws_eip.tracker.public_ip}.
    DNS is pointed. SSL bootstraps automatically — no manual steps needed.

    The site will be live at https://jamesisonline.com in ~3-5 minutes.

    To check progress:
      ssh -i ${path.module}/tracker-${var.environment}.pem ec2-user@${aws_eip.tracker.public_ip}
      sudo tail -f /var/log/user-data.log

  EOT

  next_step_test = <<-EOT

    Test environment — DNS is NOT updated. Your live site is unaffected.
    The server is booting now (takes ~3 minutes). Verify with:

      ssh -i ${path.module}/tracker-${var.environment}.pem ec2-user@${aws_eip.tracker.public_ip}
      docker-compose -f ~/tracker/compose.yml ps

    When ready to go live, change environment = "prod" in terraform.tfvars and run terraform apply again.

  EOT
}

output "next_step" {
  description = "What to do after apply"
  value       = var.environment == "prod" ? local.next_step_prod : local.next_step_test
}
