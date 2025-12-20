provider "aws" {
  region = var.aws_region
}

# Reference shared VPC state
data "terraform_remote_state" "shared" {
  backend = "remote"
  config = {
    organization = "PowerCord"
    workspaces = {
      name = "powercord-shared-vpc"
    }
  }
}

# Reference API state for private IP
data "terraform_remote_state" "api" {
  backend = "remote"
  config = {
    organization = "PowerCord"
    workspaces = {
      name = "powercord-api"
    }
  }
}

# ECR Repository for Node.js bot Docker image
resource "aws_ecr_repository" "bot_repo" {
  name                 = "powercord-bot"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

# Ubuntu AMI for EC2
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  owners = ["099720109477"] # Canonical
}

# Add ingress rule for health check (port 3000 open publicly)
resource "aws_security_group_rule" "health_ingress" {
  security_group_id = data.terraform_remote_state.shared.outputs.internal_sg_id
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"] # Open to all; restrict to your uptime service IP if known
}

# EC2 Instance (in public subnet, with public IP for health check)
resource "aws_instance" "bot_server" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = data.terraform_remote_state.shared.outputs.public_subnet_ids[0]
  vpc_security_group_ids      = [data.terraform_remote_state.shared.outputs.internal_sg_id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  associate_public_ip_address = true # Required for public health check

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Install Docker
    apt-get update
    apt-get install -y ca-certificates curl
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Start Docker
    systemctl start docker
    systemctl enable docker

    # Login to ECR
    aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.bot_repo.repository_url}

    # Pull and run the container
    docker pull ${aws_ecr_repository.bot_repo.repository_url}:${var.image_tag}
    docker run -d --name powercord-bot --restart always -p 3000:3000 \
      -e CLIENT_ID=${var.client_id} \
      -e DISCORD_TOKEN=${var.discord_token} \
      -e API_BASE_URL=http://${data.terraform_remote_state.api.outputs.instance_private_ip}:8080 \
      -e ENABLE_MOCK_API=${var.enable_mock_api} \
      -e LOGTAIL_SOURCE_TOKEN=${var.logtail_source_token} \
      -e LOGTAIL_INGESTING_HOST=${var.logtail_ingesting_host} \
      ${aws_ecr_repository.bot_repo.repository_url}:${var.image_tag}
  EOF

  tags = {
    Name = var.instance_name
  }
}

# IAM Role and Profile for EC2 to access ECR
resource "aws_iam_role" "ec2_role" {
  name = "powercord-bot-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "powercord-bot-ec2-profile"
  role = aws_iam_role.ec2_role.name
}
