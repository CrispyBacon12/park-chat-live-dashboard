# AWS Infrastructure

These scripts are used to create a single instance running docker, and exposed on a public IP.

The instance will be created in an isolated VPC, 

## Usage
```bash
$ npm run terraform:plan -- --access_key=[ACCESS_KEY] --secret_key=[SECRET_KEY]
```

```bash
$ npm run terraform:apply -- --access_key=[ACCESS_KEY] --secret_key=[SECRET_KEY]
```
