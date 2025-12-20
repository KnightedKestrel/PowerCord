terraform {
  cloud {
    organization = "PowerCord"

    workspaces {
      project = "PowerCord Bot"
      name    = "powercord-bot"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  required_version = ">= 1.2"
}
