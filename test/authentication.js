'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);


describe('basic authentication', () => {
  zapier.tools.env.inject();

  it('should authenticate', (done) => {
    const bundle = {
      authData: {
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        business: process.env.business
      }
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        should.exist(response.accessToken);
        done();
      })
      .catch(done);
  });

});
