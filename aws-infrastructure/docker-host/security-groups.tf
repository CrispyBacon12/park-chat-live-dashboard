resource "aws_security_group" "docker-host" {
  name          = "${var.vpc_key}-sg"
  description   = "Security group for docker host"
  vpc_id        = "${aws_vpc.vpc.id}"

  # TCP port 8000 for ELB traffic
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  # SSH allowed
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  # Allow all on outbound
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
