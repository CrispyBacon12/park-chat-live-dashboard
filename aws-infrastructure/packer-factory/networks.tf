provider "aws" {
  region            = "${var.aws_region}"
  access_key        = "${var.access_key}"
  secret_key        = "${var.secret_key}"
}

data "aws_availability_zones" "available" {}

resource "aws_vpc" "vpc" {
  cidr_block        = "10.2.0.0/16"

  tags {
    Name            = "${var.vpc_key}-vpc"
    VPC             = "${var.vpc_key}"
    Terraform       = "Terraform"
  }
}

resource "aws_subnet" "public_a" {
  vpc_id            = "${aws_vpc.vpc.id}"
  cidr_block        = "${cidrsubnet(aws_vpc.vpc.cidr_block,8,1)}"
  availability_zone = "${data.aws_availability_zones.available.names[0]}"

  tags {
    Name            = "${var.vpc_key}-subnet_public_a"
    VPC             = "${var.vpc_key}"
    Terraform       = "Terraform"
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id            = "${aws_vpc.vpc.id}"

  tags {
    Name            = "${var.vpc_key}-ig"
    VPC             = "${var.vpc_key}"
    Terraform       = "Terraform"
  }
}

resource "aws_route_table" "internet_gateway_routing" {
  vpc_id            = "${aws_vpc.vpc.id}"

  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = "${aws_internet_gateway.gateway.id}"
  }

  tags {
    Name            = "${var.vpc_key}-route"
    VPC             = "${var.vpc_key}"
    Terraform       = "Terraform"
  }
}

resource "aws_route_table_association" "a" {
  route_table_id    = "${aws_route_table.internet_gateway_routing.id}"
  subnet_id         = "${aws_subnet.public_a.id}"
}

output "packer_subnet" {
  value             = "${aws_subnet.public_a.id}"
}

output "packer_vpc" {
  value             = "${aws_vpc.vpc.id}"
}
