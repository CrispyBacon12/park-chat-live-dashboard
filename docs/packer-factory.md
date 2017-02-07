# Packer Factory
These scripts are used to create an AMI in the target region, intended for use as a docker host.

A series of terraform and packer scripts are executed, in order to:
 * create an isolated VPC temporarily
 * create AMI using isolated VPC
 * destroy the VPC

The output AMI will have the name `docker-host_{{uuid}}` and be tagged with a `Packer_Intent: docker-host`. The AMI can be filtered by this tag when creating instances.

## Usage

```bash
$ npm run packer -- --access_key=[ACCESS_KEY] --secret_key=[SECRET_KEY]
```