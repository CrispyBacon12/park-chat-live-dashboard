variable "aws_region" {
  description = "AWS region to launch servers in."
  default     = "ap-southeast-2"
}

variable "vpc_key" {
  description = "A unique identifier for the VPC."
  default     = "packer_factory"
}

variable "access_key" {
  description = "AWS access key."
}

variable "secret_key" {
  description = "AWS secret key."
}
