const taskCreate = require('./creates/task');
const authentication = require('./authentication');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  beforeRequest: [
  ],
  afterResponse: [
  ],
  resources: {
  },
  triggers: {
  },
  searches: {
  },
  creates: {
    [taskCreate.key]: taskCreate,
  }
};

module.exports = App;
