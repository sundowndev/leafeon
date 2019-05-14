"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class RouterRequest
 */
var RouterRequest = /** @class */ (function () {
    function RouterRequest() {
        var _this = this;
        /**
         * @function getURI
         * @returns {string}
         */
        this.getURI = function () {
            return _this.URI = _this.formatPath(_this.windowObj.location.hash);
        };
        /**
         * @function    setURI
         * @param route string
         */
        this.setURI = function (route) {
            _this.windowObj.location.hash = route;
        };
        /**
         * @function formatPath
         * @description Format given path
         * @param path
         */
        this.formatPath = function (path) {
            if (path === '') {
                return '/';
            }
            if (path.match(/^(?:\/)?(?:\#)?(?:\/)?[a-zA-Z0-9\-_\/:]+/)[0] !== path) {
                _this.exception('Path is not formated correctly.');
            }
            return path.replace(/^(?:\/)?(?:\#)?(?:\/)/, '/');
        };
        /**
         * @function exception
         * @param {string} message
         * @returns {never}
         */
        this.exception = function (message) {
            throw new TypeError(message);
        };
        /**
         * @function    windowListener
         * @param route string
         */
        this.windowListener = function (callback) {
            if (typeof window !== 'undefined') {
                window.onhashchange = function () {
                    callback();
                };
            }
        };
        var fakeLocation = {
            location: {
                href: '/#/',
                hash: '#/',
            },
        };
        this.windowObj = (typeof window === 'undefined') ? fakeLocation : window;
        this.URI = this.getURI();
    }
    return RouterRequest;
}());
/**
 * @package leafeon
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        var _this = _super.call(this) || this;
        /**
         * @function setErrorCallback
         * @param func
         */
        _this.setErrorCallback = function (func) {
            _this.notFoundCallback = func;
            return _this;
        };
        /**
         * @function notFoundException
         */
        _this.notFoundException = function () {
            _this.notFoundCallback.apply(null, []);
        };
        /**
         * @function before
         * @description Before route function
         * @param route
         * @param func
         */
        _this.before = function (route, func) {
            _this.beforeRouteMiddleware = route;
            _this.beforeRouteMiddlewareFunc = func;
            return _this;
        };
        /**
         * @function add
         * @param {string} name
         * @param {string} path
         * @param callback
         */
        _this.add = function (name, path, callback) {
            var routeArray = path.split('/');
            var paramsEnabled = false;
            var params = [];
            routeArray.forEach(function (r) {
                if (r.substr(0, 1) === ':') {
                    paramsEnabled = true;
                    params.push(r.substr(1, r.length));
                }
            });
            _this.paramsEnabled = paramsEnabled;
            path = path.split('#')[1] || path;
            _this.routes.push({
                name: name,
                path: path,
                callback: callback,
                paramsEnabled: paramsEnabled,
                params: params,
            });
            return _this;
        };
        /**
         * @function map
         * @description Mapping routes into a specific path
         * @param name
         * @param mount
         * @param routes
         */
        _this.map = function (name, mount, routes) {
            routes.forEach(function (route) {
                _this.add(name + route.name, mount + _this.formatPath(route.path), route.callback);
            });
            return _this;
        };
        /**
         * @function fetchRoute
         * @description Target a given route by name or path
         * @param route
         * @param params
         */
        _this.fetchRoute = function (route, params) {
            var targetRoute = _this.routes.find(function (targetedRoute) {
                return targetedRoute.name === route || targetedRoute.path === route;
            });
            if (targetRoute === undefined) {
                return _this.exception('Route ' + route + ' does not exist.');
            }
            if (!targetRoute.paramsEnabled) {
                _this.setURI(targetRoute.path);
                return;
            }
            if (!params) {
                _this.exception('Error: route "' + route + '" requires some parameters. None specified.');
            }
            var generatedURI = _this.generateURL(targetRoute.path, params);
            _this.setURI(generatedURI);
        };
        /**
         * @function generateURL
         * @description Generate URL from route and parameters
         * @param route
         * @param params
         * @returns string
         */
        _this.generateURL = function (route, params) {
            var generatedURI = route;
            Object.keys(params).forEach(function (p) {
                var paramInRoute = route.split('/').find(function (targetParam) {
                    return targetParam === ':' + p;
                });
                if (paramInRoute !== undefined) {
                    generatedURI = generatedURI.replace(paramInRoute, params[p]);
                }
            });
            return generatedURI;
        };
        /**
         * @function setRoute
         * @description Set the route callback if it match
         * @param route
         * @param params
         */
        _this.setRoute = function (route, params) {
            if (params === void 0) { params = []; }
            _this.route = route;
            _this.routeCall = route.callback;
            _this.params = params;
            _this.notfound = false;
        };
        /**
         * @function handle
         * @description Check route
         * @param routes
         */
        _this.handle = function (routes) {
            var URI = _this.getURI();
            routes.forEach(function (route) {
                var routeArray = route.path.split('/');
                var uriArray = URI.split('/');
                if (uriArray.length !== routeArray.length) {
                    return;
                }
                var routeOptions = _this.handlingParams(route.path);
                if (routeOptions.RouteString === URI && _this.notfound) {
                    return _this.setRoute(route, routeOptions.params);
                }
            });
        };
        /**
         * @function handlingParams
         * @param {string} route
         * @returns {object}
         */
        _this.handlingParams = function (route) {
            var uriArray = _this.getURI().split('/');
            var routeArray = route.split('/');
            var params = [];
            for (var i = 0; i < routeArray.length; i++) {
                if (routeArray[i].substr(0, 1) === ':') {
                    if (uriArray[i] !== '') {
                        params.push(uriArray[i]);
                    }
                    routeArray[i] = uriArray[i];
                }
            }
            return {
                params: params,
                RouteString: routeArray.join('/'),
            };
        };
        /**
         * @function run
         * @description Run the router and search for a route match
         * @param afterRouteCallback
         */
        _this.run = function (afterRouteCallback) {
            _this.route = null;
            _this.routeCall = null;
            _this.params = [];
            _this.notfound = true;
            var URI = _this.getURI();
            var routes = [];
            // Execute before middleware
            _this.beforeMiddleware(_this.beforeRouteMiddleware, _this.beforeRouteMiddlewareFunc);
            _this.routes.forEach(function (route) {
                if (route.paramsEnabled) {
                    routes.push(route);
                    _this.handle(routes);
                }
                else if (route.path === URI) {
                    _this.setRoute(route);
                }
            });
            // If there's a route match, execute the callback
            if (_this.notfound) {
                _this.notFoundException();
            }
            else {
                _this.routeCall.apply(null, _this.params);
            }
            // Call after middleware
            if (afterRouteCallback != null) {
                _this.afterRouteCallback = afterRouteCallback;
                _this.afterRouteCallback.apply(null, []);
            }
            else if (_this.afterRouteCallback != null) {
                _this.afterRouteCallback.apply(null, []);
            }
        };
        /**
         * @function beforeMiddleware
         * @param {string} route
         * @param callback
         */
        _this.beforeMiddleware = function (route, callback) {
            route = route.split('#')[1] || route;
            if (callback != null) {
                if (route === '*') {
                    return callback.apply(null, []);
                }
                else if (route === _this.getURI()) {
                    return callback.apply(null, []);
                }
            }
        };
        _this.notfound = true; // While a route has not match the URI, set page as not found
        _this.routes = [];
        _this.paramsEnabled = false;
        _this.route = null;
        _this.params = [];
        _this.beforeRouteMiddleware = '*';
        _this.routeCall = null;
        _this.beforeRouteMiddlewareFunc = null;
        _this.afterRouteCallback = null;
        _this.notFoundCallback = null;
        _this.windowListener(_this.run);
        return _this;
    }
    return Router;
}(RouterRequest));
exports.Router = Router;
//# sourceMappingURL=leafeon.js.map