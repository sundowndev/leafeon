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
  it('should find matching route', () => {
    r.routes = []; // Reset registered routes

    r.add('testFetchRoute', '/test-fetch-route', () => {});

    r.fetchRoute('testFetchRoute');

    assert.equal(r.getURI(), '/test-fetch-route');
  });

  /*it('should call not found callback', () => {
    r.routes = []; // Reset registered routes

    assert.throws(() => { r.fetchRoute('test'); }, Error, 'Route test does not exist.');
  });*/
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

describe('Router.handle', () => {
  it('should set proper route', () => {
    r.routes = []; // reset registered routes
    r.setURI('#/hello/world'); // set fake URI

    r.routes = [
      {
        name: 'name',
        path: '/:name',
        callback: () => {},
        paramsEnabled: true,
        params: ['name'],
      },
      {
        name: 'hello',
        path: '/hello/:name',
        callback: () => {},
        paramsEnabled: true,
        params: ['name'],
      },
      {
        name: 'foo',
        path: '/foo/:id/bar',
        callback: () => {},
        paramsEnabled: true,
        params: ['id'],
      },
    ];

    r.handle(r.routes);

    assert.equal(r.route, r.routes[1]);
    assert.equal(r.routeCall, r.routes[1].callback);
    assert.deepEqual(r.params, ['world']);
  });

  it('should not set any route', () => {
    r.route = {}; // reset route
    r.routes = []; // reset registered routes
    r.setURI('#/hi/world'); // set fake URI

    r.routes = [
      {
        name: 'name',
        path: '/:name',
        callback: () => {},
        paramsEnabled: true,
        params: ['name'],
      },
      {
        name: 'hello',
        path: '/hello/:name',
        callback: () => {},
        paramsEnabled: true,
        params: ['name'],
      },
      {
        name: 'foo',
        path: '/foo/:id/bar',
        callback: () => {},
        paramsEnabled: true,
        params: ['id'],
      },
    ];

    r.handle(r.routes);

    assert.deepEqual(r.route, {});
  });
});

// -------------------------------- HANDLINGPARAMS FUNCTION -------------------------------- //

describe('Router.handlingParams', () => {
  it('should return route with params', () => {
    r.route = {}; // reset route
    r.routes = []; // reset registered routes
    r.setURI('#/user/1/delete'); // set fake URI

    const route = '/user/:id/:action';

    const params = r.handlingParams(route);

    assert.deepEqual(params, {
      params: ['1', 'delete'],
      RouteString: '/user/1/delete',
    });
  });
});
