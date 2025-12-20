output "ecr_repository_url" {
  description = "URL of the ECR repository for Node.js bot"
  value       = aws_ecr_repository.bot_repo.repository_url
}

output "instance_public_ip" {
  description = "Public IP of the Node.js bot EC2 instance (for health check)"
  value       = aws_instance.bot_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP of the Node.js bot EC2 instance"
  value       = aws_instance.bot_server.private_ip
}

output "instance_id" {
  description = "ID of the Node.js bot EC2 instance"
  value       = aws_instance.bot_server.id
}
