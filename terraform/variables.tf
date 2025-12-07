variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-2"
}

variable "instance_type" {
  description = "The EC2 instance's type."
  type        = string
  default     = "t2.micro"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "powercord-bot"
}

variable "image_tag" {
  description = "Docker image tag for the Node.js bot"
  type        = string
  default     = "latest"
}

variable "client_id" {
  description = "Discord Client ID (sensitive)"
  type        = string
  sensitive   = true
}

variable "discord_token" {
  description = "Discord Token (sensitive)"
  type        = string
  sensitive   = true
}

variable "enable_mock_api" {
  description = "Enable mock API mode"
  type        = string
  default     = "false"
}

variable "logtail_source_token" {
  description = "Logtail Source Token (sensitive if used)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "logtail_ingesting_host" {
  description = "Logtail Ingesting Host"
  type        = string
  default     = ""
}

# Note: API_BASE_URL is dynamically set in user_data using API's private IP
