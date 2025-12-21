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

# Launch Template for ECS EC2 Instances
resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "powercord-bot-"
  image_id      = data.aws_ami.ecs_optimized.id
  instance_type = var.instance_type

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [data.terraform_remote_state.shared.outputs.internal_sg_id]
  }

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
}

# Auto Scaling Group for ECS Capacity
resource "aws_autoscaling_group" "ecs_asg" {
  name                  = "powercord-bot-asg"
  min_size              = 1
  max_size              = 1
  desired_capacity      = 1
  vpc_zone_identifier   = data.terraform_remote_state.shared.outputs.public_subnet_ids
  protect_from_scale_in = true

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = var.instance_name
    propagate_at_launch = true
  }
}

# ECS Capacity Provider
resource "aws_ecs_capacity_provider" "ec2_provider" {
  name = "powercord-bot-ec2-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs_asg.arn
    managed_termination_protection = "ENABLED"
  }
}

# Attach Capacity Provider to Cluster
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.bot_cluster.name
  capacity_providers = [aws_ecs_capacity_provider.ec2_provider.name]
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
    environment = [
      { name = "CLIENT_ID", value = var.client_id },
      { name = "DISCORD_TOKEN", value = var.discord_token },
      { name = "API_BASE_URL", value = "http://${data.terraform_remote_state.api.outputs.instance_private_ip}:8080" },
      { name = "ENABLE_MOCK_API", value = var.enable_mock_api },
      { name = "LOGTAIL_SOURCE_TOKEN", value = var.logtail_source_token },
      { name = "LOGTAIL_INGESTING_HOST", value = var.logtail_ingesting_host }
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

# Add ingress rule for health check (port 3000 open publicly)
resource "aws_security_group_rule" "health_ingress" {
  security_group_id = data.terraform_remote_state.shared.outputs.internal_sg_id
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}
