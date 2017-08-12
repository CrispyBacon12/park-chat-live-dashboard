# Park Chat Live Dashboard

Provides a dashboard for managing and monitoring live streams.

> **HEAVILY IN PROGRESS**

* Aggregates comments across facebook and youtube into a single comment stream
* Monitor viewers over time across platforms
* More to come

### Install
Checkout this repo, install dependencies, then start the dev server + ws endpoints with:

```
	> npm install
	> npm start
```

### Usage
There are two views to this application: **presenter** and **moderator**.

* To view the moderator view, navigate to: `http://localhost:8080`
* To view the presenter view, navigate to: `http://localhost:8080/presenter`

### Infrastructure Scripts
A collection of scripts used to manage and provision AWS infrastructure are included.

* [Create AMI](docs/packer-factory.md)
* [Create Docker Host](docs/aws-infrastructure.md)
