const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

const r = new leafeon.Router();

// -------------------------------- ADD FUNCTION -------------------------------- //

describe('Router.add', () => {
  it('should return route name', () => {
    r.add('test', '/test', () => {});

    assert.equal(r.routes[0].name, 'test');
  });

  it('should return route path', () => {
    r.add('test', '/test', () => {});

    assert.equal(r.routes[0].path, '/test');
  });
});

// -------------------------------- FETCHROUTE FUNCTION -------------------------------- //

describe('Router.fetchRoute', () => {
  it('should throw exception', () => {
    r.routes = []; // Reset registered routes

    r.add('testFetchRoute', '/test-fetch-route', () => {});

    r.fetchRoute('testFetchRoute');

    assert.equal(r.getURI(), '/test-fetch-route');
  });

  it('should throw exception', () => {
    r.routes = []; // Reset registered routes

    assert.throws(() => { r.fetchRoute('test'); }, Error, 'Route test does not exist.');
  });
});

// -------------------------------- FORMATPATH FUNCTION -------------------------------- //

describe('Router.formatPath', () => {
  it('should return "/"', () => {
    const path = '';
    const formated = r.formatPath(path, true);

    assert.equal(formated, '/');
  });

  it('should return "/foo_bar"', () => {
    const path = '/#/foo_bar';
    const formated = r.formatPath(path, true);

    assert.equal(formated, '/foo_bar');
  });

  it('should return "/docs/getting-started"', () => {
    const path = '#/docs/getting-started';
    const formated = r.formatPath(path);

    assert.equal(formated, '/docs/getting-started');
  });

  it('should return "/hello/:name"', () => {
    const path = '/hello/:name';
    const formated = r.formatPath(path);

    assert.equal(formated, '/hello/:name');
  });

  it('should throw exception', () => {
    const path = '/foo*bar';

    assert.throws(() => { r.formatPath(path); }, Error, 'Path is not formated correctly');
  });
});

// -------------------------------- GENERATEURL FUNCTION -------------------------------- //

describe('Router.generateURL', () => {
  it('should return route with params', () => {
    const path = r.generateURL('/account/:id/settings/:section', {id: 1, section: 'password'});

    assert.equal(path, '/account/1/settings/password');
  });
});

// -------------------------------- HANDLE FUNCTION -------------------------------- //
// -------------------------------- HANDLINGPARAMS FUNCTION -------------------------------- //
