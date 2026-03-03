variable "region" {
  description = "AWS region"
  default     = "us-east-2"
}

variable "environment" {
  description = "Deployment environment. Use 'test' to spin up infra without touching DNS. Use 'prod' to update Route 53 records."
  default     = "test"
}

variable "domain" {
  description = "Root domain name (must have an existing Route 53 hosted zone)"
  default     = "jamesisonline.com"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.nano"
}

variable "s3_bucket_name" {
  description = "S3 bucket for the frontend. Use 'jamesisonline' for prod. Use a unique name (e.g. 'jamesisonline-test') for test since bucket names are globally unique."
}

variable "db_name" {
  description = "Postgres database name"
  default     = "app"
}

variable "db_user" {
  description = "Postgres username"
  default     = "postgres"
}

variable "db_password" {
  description = "Postgres password"
  sensitive   = true
}

variable "secret_key" {
  description = "JWT signing secret"
  sensitive   = true
}

variable "db_port" {
  description = "Postgres port"
  default     = "5432"
}

variable "app_port" {
  description = "Backend app port"
  default     = "3000"
}

variable "frontend_path" {
  description = "Absolute path to the tracker-client repo on your local machine"
  default     = "/Users/admin/Documents/Code/tracker_client"
}
