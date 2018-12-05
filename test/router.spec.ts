const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

//const MockBrowser = require('mock-browser').mocks.MockBrowser;
//const mock = new MockBrowser();

before(() => {});
after(() => {});

describe('Router.add', function() {
  it('should return route name', function() {
    const r = new leafeon.router();

    r.add('test', '/test', () => {});

    assert.equal(r.routes[0].name, 'test');
  });

  it('should return route path', function() {
    const r = new leafeon.router();

    r.add('test', '/test', () => {});

    assert.equal(r.routes[0].path, '/test');
  });
});

describe('Router.generateURL', function() {
  it('should return route with params', function() {
    const r = new leafeon.router();

    const path = r.generateURL('/account/:id/settings/:section', {id: 1, section: 'password'});

    assert.equal(path, '/account/1/settings/password');
  });
});
