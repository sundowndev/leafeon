const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

const r = new leafeon.Router();

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
