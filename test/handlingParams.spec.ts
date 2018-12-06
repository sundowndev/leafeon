const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

const r = new leafeon.Router();

/*describe('Router.generateURL', () => {
  it('should return route with params', () => {
    const path = r.generateURL('/account/:id/settings/:section', {id: 1, section: 'password'});

    assert.equal(path, '/account/1/settings/password');
  });
});*/
