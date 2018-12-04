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
            return _this.URI = window.location.href.split('#')[1] || '/';
        };
        /**
         * @function    setURI
         * @param route string
         */
        this.setURI = function (route) {
            window.location.hash = route;
        };
        this.URI = this.getURI();
    }
    return RouterRequest;
}());
/**
 * @package leafeon
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
var router = /** @class */ (function (_super) {
    __extends(router, _super);
    function router() {
        var _this = _super.call(this) || this;
        /**
         * @function setErrorCallback
         * @param func
         */
        _this.setErrorCallback = function (func) {
            _this.notFoundCallback = func;
        };
        /**
         * @function notFoundException
         */
        _this.notFoundException = function () {
            _this.notFoundCallback.apply(null, []);
        };
        /**
         * @function before
         *
         * Before route function
         *
         * @param route
         * @param func
         */
        _this.before = function (route, func) {
            _this.BeforeRouteMiddleware = route;
            _this.BeforeRouteMiddlewareFunc = func;
        };
        /**
         * @function add
         * @param {string} name
         * @param {string} path
         * @param callback
         */
        _this.add = function (name, path, callback) {
            var routeArray = path.split('/');
            var paramsEnabled = false, params = [];
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
                params: params
            });
        };
        /**
         * @function map
         *
         * Mapping routes into a specific path
         *
         * @param name
         * @param mount
         * @param routes
         */
        _this.map = function (name, mount, routes) {
            routes.forEach(function (route) {
                _this.add(name + route.name, mount + _this.FormatPath(route.path, true), route.callback);
            });
        };
        /**
         * @function fetchRoute
         *
         * Target a given route by name or path
         *
         * @param Route
         * @param params
         */
        _this.fetchRoute = function (Route, params) {
            var targetRoute = _this.routes.find(function (route) {
                return route.name === Route || route.path === Route;
            });
            if (targetRoute == undefined) {
                return _this.Exception('Route ' + Route + ' does not exist.');
            }
            if (!targetRoute.paramsEnabled) {
                _this.setURI(targetRoute.path);
                return;
            }
            if (!params)
                _this.Exception('Error: route "' + Route + '" requires some parameters. None specified.');
            var generatedURI = _this.generateURL(targetRoute.path, params);
            _this.setURI(generatedURI);
        };
        /**
         * @function generateURL
         *
         * Generate URL from route and parameters
         *
         * @param route
         * @param params
         * @returns string
         */
        _this.generateURL = function (route, params) {
            var generatedURI = route;
            var _loop_1 = function (p) {
                var paramInRoute = route.split('/').find(function (targetParam) {
                    return targetParam === ':' + p;
                });
                if (paramInRoute == undefined) {
                    return "continue";
                }
                generatedURI = generatedURI.replace(paramInRoute, params[p]);
            };
            for (var p in params) {
                _loop_1(p);
            }
            return generatedURI;
        };
        /**
         * @function FormatPath
         *
         * Format given path
         *
         * @param path
         * @param OnlySlash
         */
        _this.FormatPath = function (path, OnlySlash) {
            if (OnlySlash === void 0) { OnlySlash = false; }
            if (OnlySlash && path === '/') {
                path = '';
            }
            else if (!OnlySlash && path.substr(0, 1) === '/') {
                path = path.substr(1);
            }
            return path;
        };
        /**
         * @function setRoute
         *
         * Set the route callback if it match
         *
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
         *
         * Check route
         *
         * @param routes
         */
        _this.handle = function (routes) {
            var URI = _this.getURI();
            routes.forEach(function (route) {
                var RouteArray = route.path.split('/');
                var URIarray = URI.split('/');
                if (URIarray.length !== RouteArray.length) {
                    return;
                }
                var RouteOptions = _this.handlingParams(route.path);
                if (RouteOptions.RouteString === URI && _this.notfound) {
                    return _this.setRoute(route, RouteOptions.params);
                }
            });
        };
        /**
         * @function handlingParams
         * @param {string} route
         * @returns {object}
         */
        _this.handlingParams = function (route) {
            var URIarray = _this.getURI().split('/');
            var RouteArray = route.split('/');
            var params = [];
            for (var i = 0; i < RouteArray.length; i++) {
                if (RouteArray[i].substr(0, 1) === ':') {
                    if (URIarray[i] !== '') {
                        params.push(URIarray[i]);
                    }
                    RouteArray[i] = URIarray[i];
                }
            }
            return {
                params: params,
                RouteString: RouteArray.join('/')
            };
        };
        /**
         * @function run
         *
         * Run the router and search for a route match
         *
         * @param AfterRouteCallback
         */
        _this.run = function (AfterRouteCallback) {
            var URI = _this.getURI();
            var routes = [];
            // While a route has not match the URI, set page as not found
            _this.notfound = true;
            // Call before middleware
            _this.BeforeMiddleware(_this.BeforeRouteMiddleware, _this.BeforeRouteMiddlewareFunc);
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
            if (AfterRouteCallback != null) {
                _this.AfterRouteCallback = AfterRouteCallback;
                _this.AfterRouteCallback.apply(null, []);
            }
            else if (_this.AfterRouteCallback != null) {
                _this.AfterRouteCallback.apply(null, []);
            }
        };
        /**
         * @function BeforeMiddleware
         * @param {string} route
         * @param callback
         */
        _this.BeforeMiddleware = function (route, callback) {
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
        /**
         * @function Exception
         * @param {string} message
         * @returns {never}
         */
        _this.Exception = function (message) {
            throw new TypeError(message);
        };
        _this.notfound = false;
        _this.routes = [];
        _this.paramsEnabled = false;
        _this.params = [];
        _this.BeforeRouteMiddleware = '*';
        _this.routeCall = function () { };
        _this.BeforeRouteMiddlewareFunc = function () { };
        _this.AfterRouteCallback = function () { };
        _this.route = {};
        _this.notFoundCallback = function () {
            throw new TypeError('Route not found');
        };
        window.onpopstate = function () {
            _this.run();
        };
        return _this;
    }
    return router;
}(RouterRequest));
exports.router = router;
//# sourceMappingURL=leafeon.js.map