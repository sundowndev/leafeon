const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

const r = new leafeon.Router();

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
