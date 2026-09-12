terraform { required_version = ">= 1.7"; required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } } }
provider "aws" { region = var.region }
variable "region" { default = "ap-south-1" }
variable "environment" { type = string }
# Account-bound resources are added only after AWS account, budget and deployment approval.
