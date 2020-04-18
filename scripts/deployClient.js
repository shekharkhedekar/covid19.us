const Deploy = require('./deployBase').default;

const deployClient = new Deploy({
  localRoot: `${__dirname}/build`,
  remoteRoot: '/shekharkhedekar/covid19',
});

deployClient.deploy();
