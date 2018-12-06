const assert = require('assert');
const sinon = require('sinon');

const leafeon = require('../src/leafeon');

const r = new leafeon.Router();

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
