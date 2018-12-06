const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

//const MockBrowser = require('mock-browser').mocks.MockBrowser;
//const mock = new MockBrowser();

/*before(() => {});
after(() => {});*/

const r = new leafeon.Router();

describe('Router.add', () => {
  it('should return route name', () => {
    r.add('test', '/test', () => {
      // code
    });

    assert.equal(r.routes[0].name, 'test');
  });

  it('should return route path', () => {
    r.add('test', '/test', () => {
      // code
    });

    assert.equal(r.routes[0].path, '/test');
  });
});

describe('Router.generateURL', () => {
  it('should return route with params', () => {
    const path = r.generateURL('/account/:id/settings/:section', {id: 1, section: 'password'});

    assert.equal(path, '/account/1/settings/password');
  });
});

describe('Router.formatPath', () => {
  it('should return formated path', () => {
    const path = '/#/foo_bar';
    const formated = r.formatPath(path, true);

    assert.equal(formated, '/foo_bar');
  });

  it('should return path formated', () => {
    const path = '#/docs/getting-started';
    const formated = r.formatPath(path);

    assert.equal(formated, '/docs/getting-started');
  });

  it('should return path formated', () => {
    const path = '/hello/:name';
    const formated = r.formatPath(path);

    assert.equal(formated, '/hello/:name');
  });

  it('should throw exception', () => {
    const path = '/foo*bar';

    assert.throws(() => { r.formatPath(path); }, Error, 'Path is not formated correctly');
  });
});
