output "ecr_repository_url" {
  description = "URL of the ECR repository for Node.js bot"
  value       = aws_ecr_repository.bot_repo.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.bot_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.bot_service.name
}
