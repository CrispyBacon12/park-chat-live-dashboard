resource "aws_security_group" "packer_factory" {
  name          = "${var.vpc_key}-sg"
  description   = "Security group for temporary instances used by Packer while building AMIs"
  vpc_id        = "${aws_vpc.vpc.id}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  tags {
    Name        = "${var.vpc_key}-sg"
    VPC         = "${var.vpc_key}"
    Terraform   = "Terraform"
  }
}

output "packer_security_group" {
  value = "${aws_security_group.packer_factory.id}"
}
