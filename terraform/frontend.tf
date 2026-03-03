# Builds the frontend and syncs it to S3. Only runs in prod.
# In test mode the nginx config still points to the prod bucket, so syncing
# to a test bucket would have no effect.
resource "null_resource" "frontend_deploy" {
  count = var.environment == "prod" ? 1 : 0

  # Re-triggers whenever the S3 bucket is replaced (i.e. fresh apply)
  triggers = {
    bucket = aws_s3_bucket.frontend.id
  }

  provisioner "local-exec" {
    working_dir = var.frontend_path
    interpreter = ["/bin/zsh", "-l", "-c"]
    command     = "yarn install && VITE_API_URL=https://api.${var.domain} yarn build && aws s3 sync ./dist s3://${aws_s3_bucket.frontend.id} --delete"
  }

  depends_on = [aws_s3_bucket_policy.frontend]
}
