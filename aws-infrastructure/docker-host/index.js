/**
 * Helper script to run docker and mount the current directory. Using an NPM script directly would be preferred,
 * but I need compatibility with Windows and it seems to choke on $(pwd). This is the workaround.
 *
 * Equivalent to:
 *  docker run -it --rm -v $(pwd):/data hashicorp/terraform:light [CMD] /data
 */
const argv = require('yargs').argv;
const spawn = require('child_process').spawn;

const docker = spawn('docker', [
  'run',
  '--rm',
  '-v', `${__dirname}:/data`,
  '-w', '/data',
  'hashicorp/terraform:light',
  argv.tf_command,
  '-var', `access_key=${argv.access_key}`,
  '-var', `secret_key=${argv.secret_key}`,
], {
  stdio: 'inherit'
});
