/* eslint-disable no-console */
const FtpDeploy = require('ftp-deploy');

class Deploy {
  constructor(config) {
    if (!config || !config.localRoot || !config.remoteRoot) {
      throw new Error('config.localRoot and config.remoteRoot must be defined');
    }

    this.ftpDeploy = new FtpDeploy();
    this.config = {
      username: 'u40157445',
      host: 'ftp.wgirankings.com',
      port: 21,
      continueOnError: true,
      ...config,
    };

    this.ftpDeploy.on('uploaded', (data) => {
      const {
        transferredFileCount,
        totalFileCount,
        filename,
      } = data;
      console.log(`Uploaded ${transferredFileCount}/${totalFileCount}: ${filename}`);
    });

    this.ftpDeploy.on('upload-error', (data) => {
      console.log(`Error uploading: ${data.err}`);
    });
  }

  deploy() {
    this.ftpDeploy.deploy(this.config, (err) => {
      if (err) {
        console.log(`Error deploying: ${err.message}`);
      } else {
        console.log('Deploy complete.');
      }
    });
  }
}

module.exports.default = Deploy;
