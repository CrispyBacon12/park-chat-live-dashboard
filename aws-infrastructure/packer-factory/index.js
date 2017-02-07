/**
 * Helper script to run a sequence of terraform and packer scripts, in order to:
 *  - create isolated VPC
 *  - create AMI using isolated VPC
 *  - destroy VPC
 *
 */
const argv = require('yargs').argv;
const spawn = require('child_process').spawn;
const stream = require('stream');

function createPackerVpc() {
  return new Promise((resolve, reject) => {
    const dockerChild = spawn('docker', [
      'run',
      '--rm',
      '-v', `${__dirname}:/data`,
      '-w', '/data',
      'hashicorp/terraform:light',
      'apply',
      '-var', `access_key=${argv.access_key}`,
      '-var', `secret_key=${argv.secret_key}`
    ], {
      stdio: 'inherit'
    });
    
    dockerChild.on('close', (code) => {
      if (code) {
        return reject(code);
      }

      return resolve();
    });
  });
}

function destroyPackerVpc() {
  return new Promise((resolve, reject) => {
    const dockerChild = spawn('docker', [
      'run',
      '--rm',
      '-v', `${__dirname}:/data`,
      '-w', '/data',
      'hashicorp/terraform:light',
      'destroy', '-force',
      '-var', `access_key=${argv.access_key}`,
      '-var', `secret_key=${argv.secret_key}`
    ], {
      stdio: 'inherit'
    });

    dockerChild.on('close', (code) => {
      if (code) {
        return reject(code);
      }

      return resolve();
    });
  });
}

function getOutputs() {
  return new Promise((resolve, reject) => {
    var outputString = '';

    const dockerChild = spawn('docker', [
      'run',
      '--rm',
      '-v', `${__dirname}:/data`,
      '-w', '/data',
      'hashicorp/terraform:light',
      'output',
      '-json'
    ], {
      stdio: [process.stdin, 'pipe', process.stderr]
    });

    dockerChild.stdout.on('data', (data) => {
      outputString += data;
    })

    dockerChild.on('close', (code) => {
      if (code) {
        return reject(code);
      }

      return resolve(JSON.parse(outputString));
    });
  });
}

function runPacker(securityGroupId, subnetId) {
  return new Promise((resolve, reject) => {
    const packerChild = spawn('docker', [
      'run',
      '--rm',
      '-v', `${__dirname}:/data`,
      '-w', '/data',
      'hashicorp/packer:light',
      'build',
      '-var', `access_key=${argv.access_key}`,
      '-var', `secret_key=${argv.secret_key}`,
      '-var', `security_group_id=${securityGroupId}`,
      '-var', `subnet_id=${subnetId}`,
      'docker.json'
    ], {
      stdio: 'inherit'
    });

    packerChild.on('close', (code) => {
      if (code) {
        return reject(code);
      }

      return resolve();
    });
  });
}

createPackerVpc()
.then(() => {
  return getOutputs();
})
.then((outputs) => {
  return runPacker(outputs.packer_security_group.value, outputs.packer_subnet.value);
})
.then(() => {
  return destroyPackerVpc();
})
.then(() => {
  console.log("AMI was created successfully!");
})
.catch(console.error);
