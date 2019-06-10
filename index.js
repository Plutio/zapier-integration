const taskCreate = require('./creates/task');
const projectCreate = require('./creates/project')
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
    [projectCreate.key]: projectCreate
  }
};

module.exports = App;
