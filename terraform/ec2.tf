resource "aws_security_group" "tracker" {
  name        = "tracker-${var.environment}"
  description = "Tracker app - allow SSH, HTTP, HTTPS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "tracker-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_instance" "tracker" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.tracker.key_name
  vpc_security_group_ids = [aws_security_group.tracker.id]
  subnet_id              = data.aws_subnets.default.ids[0]

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    environment = var.environment
    db_name     = var.db_name
    db_user     = var.db_user
    db_password = var.db_password
    db_port     = var.db_port
    app_port    = var.app_port
  })

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name        = "tracker-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_eip" "tracker" {
  instance = aws_instance.tracker.id
  domain   = "vpc"

  tags = {
    Name        = "tracker-${var.environment}"
    Environment = var.environment
  }
}
