data "aws_ami" "docker-host" {
  most_recent             = true
  filter {
    name                  = "tag:Packer_Intent"
    values                = ["docker-host"]
  }
  owners                  = ["self"]
}

resource "aws_key_pair" "docker-host" {
  key_name                = "${var.vpc_key}"
  public_key              = "${file("docker_host.pub")}"
}

resource "aws_instance" "host" {
  ami                     = "${data.aws_ami.docker-host.id}"
  instance_type           = "t2.micro"
  associate_public_ip_address = true
  key_name                = "${aws_key_pair.docker-host.key_name}"
  subnet_id               = "${aws_subnet.public_a.id}"
  vpc_security_group_ids  = [
    "${aws_security_group.docker-host.id}"
  ]

  tags {
    Name                  = "${var.vpc_key}-${count.index}"
    VPC                   = "${var.vpc_key}"
    Terraform             = "Terraform"
  }
}
