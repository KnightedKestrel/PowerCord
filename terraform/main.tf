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

# ECS-optimized AMI for Amazon Linux 2023
data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-ecs-hvm-*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "bot_cluster" {
  name = "powercord-bot-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# IAM Role for ECS EC2 Instances
resource "aws_iam_role" "ecs_instance_role" {
  name = "powercord-bot-ecs-instance-role"
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

resource "aws_iam_role_policy_attachment" "ecs_instance" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "powercord-bot-ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

# IAM Role for ECS Task Execution (for pulling from ECR)
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "powercord-bot-ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Single EC2 instance for ECS capacity
resource "aws_instance" "ecs_instance" {
  ami                         = data.aws_ami.ecs_optimized.id
  instance_type               = var.instance_type
  key_name                    = "powercord-bot-key"
  subnet_id                   = element(data.terraform_remote_state.shared.outputs.public_subnet_ids, 0)
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.ecs_instance_profile.name
  vpc_security_group_ids      = [data.terraform_remote_state.shared.outputs.internal_sg_id]

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    echo ECS_CLUSTER=${aws_ecs_cluster.bot_cluster.name} >> /etc/ecs/ecs.config
  EOF
  )

  tags = {
    Name = var.instance_name
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "bot_task" {
  family                   = "powercord-bot-task"
  network_mode             = "host"
  requires_compatibilities = ["EC2"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([{
    name      = "powercord-bot"
    image     = "${aws_ecr_repository.bot_repo.repository_url}:${var.image_tag}"
    essential = true
    memory    = 512
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
    }]
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
    environment = [
      { name = "CLIENT_ID", value = var.client_id },
      { name = "DISCORD_TOKEN", value = var.discord_token },
      { name = "API_BASE_URL", value = "http://powercord-api.powercord.internal:8080" },
      { name = "API_SRV_DOMAIN", value = var.api_srv_domain },
      { name = "ENABLE_MOCK_API", value = var.enable_mock_api },
      { name = "LOGTAIL_SOURCE_TOKEN", value = var.logtail_source_token },
      { name = "LOGTAIL_INGESTING_HOST", value = var.logtail_ingesting_host },
      { name = "BETTERSTACK_HEARTBEAT_URL", value = var.betterstack_heartbeat_url }
    ]
  }])
}

# ECS Service
resource "aws_ecs_service" "bot_service" {
  name            = "powercord-bot-service"
  cluster         = aws_ecs_cluster.bot_cluster.id
  task_definition = aws_ecs_task_definition.bot_task.arn
  desired_count   = 1
  launch_type     = "EC2"
}
