# DNS records are only created when environment = "prod".
# In test mode these are skipped so your live site is never affected.

resource "aws_route53_record" "root" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain
  type    = "A"
  ttl     = 300
  records = [aws_eip.tracker.public_ip]
}

resource "aws_route53_record" "api" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "api.${var.domain}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.tracker.public_ip]
}
