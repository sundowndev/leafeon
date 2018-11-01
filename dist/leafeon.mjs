/**
 * @class RouterRequest
 */
class RouterRequest {
    constructor() {
        this.getURI = () => {
            if (location.hash.substr(0, 2) === '#/') {
                this.URI = location.hash.substr(1);
            }
            return this.URI;
        };
        /**
         * @function    setURI set the current URI
         * @param route string
         */
        this.setURI = (route) => {
            location.hash = route;
        };
        this.URI = '/' + location.hash;
    }
}
/**
 * leafeon class
 *
 * @package leafeon
 * @version 2.0.4
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export class router extends RouterRequest {
    constructor() {
        super();
        this.getCurrentURI = () => {
            return this.getURI();
        };
        this.setErrorCallback = (func) => {
            this.notFoundCallback = func;
        };
        this.notFoundException = () => {
            this.notFoundCallback.apply(null, []);
        };
        /**
         * @function before
         *
         * Before route function
         *
         * @param route   string
         * @param func    object
         */
        this.before = (route, func) => {
            this.BeforeRouteMiddleware = route;
            this.BeforeRouteMiddlewareFunc = func;
        };
        /**
         * @function map
         *
         * Mapping routes into a specific path
         *
         * @param name  string
         * @param mount string
         * @param routes    array
         */
        this.map = (name, mount, routes = []) => {
            routes.forEach((route) => {
                this.add(name + route.name, mount + this.FormatPath(route.path, true), route.callback);
            });
        };
        /**
         * @function fetchRoute
         *
         * Target a given route by name or path
         *
         * @param Route string
         * @param params    array
         */
        this.fetchRoute = (Route, params) => {
            const targetRoute = this.routes.find((route) => {
                return route.name === Route || route.path === Route;
            });
            if (targetRoute == undefined) {
                this.Exception('Route ' + Route + ' does not exist.');
                return;
            }
            if (!targetRoute.paramsEnabled) {
                this.setURI(targetRoute.path);
                return;
            }
            if (!params)
                this.Exception('Error: route "' + Route + '" requires some parameters. None specified.');
            let generatedURI = this.generateURL(targetRoute.path, params);
            this.setURI(generatedURI);
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
        this.generateURL = (route, params) => {
            let generatedURI = route;
            for (let p in params) {
                if (!params.hasOwnProperty(p))
                    continue;
                const paramInRoute = route.split('/').find((targetParam) => {
                    return targetParam === ':' + p;
                });
                if (paramInRoute == undefined) {
                    continue;
                }
                generatedURI = generatedURI.replace(paramInRoute, params[p]);
            }
            return generatedURI;
        };
        /**
         * @function FormatPath
         *
         * Format given path
         *
         * @param path  string
         * @param OnlySlash boolean
         */
        this.FormatPath = (path, OnlySlash = false) => {
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
        this.setRoute = (route, params = []) => {
            this.route = route;
            this.routeCall = route.callback;
            this.params = params;
            this.notfound = false;
        };
        /**
         * @function handle
         *
         * Check route
         *
         * @param routes    array
         */
        this.handle = (routes) => {
            const URI = this.getCurrentURI();
            routes.forEach((Route) => {
                const RouteArray = Route.split('/');
                let URIarray = URI.split('/');
                if (URIarray.length !== RouteArray.length) {
                    return;
                }
                const RouteOptions = this.handlingParams(Route);
                const URIstring = URIarray.join('');
                if (RouteOptions.RouteString !== URIstring) {
                    return;
                }
                this.routes.forEach((route) => {
                    if (route.path === Route && this.notfound) {
                        this.setRoute(route, RouteOptions.params);
                    }
                });
            });
        };
        /**
         * @function run
         *
         * Run the router and search for a route match
         *
         * @param AfterRouteCallback    function
         */
        this.run = (AfterRouteCallback) => {
            const URI = this.getCurrentURI();
            let routes = [];
            // While a route has not match the URI, page is not found
            this.notfound = true;
            this.BeforeMiddleware(this.BeforeRouteMiddleware, this.BeforeRouteMiddlewareFunc);
            this.routes.forEach((route) => {
                if (route.paramsEnabled) {
                    routes.push(route.path);
                    this.handle(routes);
                }
                else if (route.path === URI) {
                    this.setRoute(route);
                }
            });
            if (this.notfound) {
                this.notFoundException();
            }
            else {
                this.routeCall.apply(null, this.params);
            }
            if (AfterRouteCallback != null) {
                this.AfterRouteCallback = AfterRouteCallback;
                this.AfterRouteCallback.apply(null, []);
            }
            else if (this.AfterRouteCallback != null) {
                this.AfterRouteCallback.apply(null, []);
            }
        };
        this.BeforeMiddleware = (route, callback) => {
            const URI = this.getURI();
            switch (route.substr(0, 2)) {
                case '#/':
                    route = route.substr(1);
                    break;
                case '/#':
                    route = route.substr(2);
                    break;
            }
            if (callback != null) {
                if (route === '*') {
                    callback.apply(null, []);
                }
                else if (route === URI) {
                    callback.apply(null, []);
                }
            }
        };
        this.handlingParams = (route) => {
            const URIarray = this.getCurrentURI().split('/');
            const RouteArray = route.split('/');
            const params = [];
            for (let i = 0; i < RouteArray.length; i++) {
                if (RouteArray[i].substr(0, 1) === ':') {
                    if (URIarray[i] !== '') {
                        params.push(URIarray[i]);
                    }
                    RouteArray[i] = URIarray[i];
                }
            }
            return {
                params: params,
                RouteString: RouteArray.join('')
            };
        };
        this.Exception = (message) => {
            throw new TypeError(message);
        };
        this.notfound = false;
        this.routes = [];
        this.paramsEnabled = false;
        this.params = [];
        this.BeforeRouteMiddleware = '*';
        this.routeCall = () => { };
        this.BeforeRouteMiddlewareFunc = () => { };
        this.AfterRouteCallback = () => { };
        this.route = {};
        this.notFoundCallback = () => {
            throw new TypeError('Route not found');
        };
        window.addEventListener('hashchange', () => {
            this.run();
        });
    }
    add(name, path, callback) {
        const routeArray = path.split('/');
        let paramsEnabled = false, params = [];
        routeArray.forEach((r) => {
            if (r.substr(0, 1) === ':') {
                paramsEnabled = true;
                params.push(r.substr(1, r.length));
            }
        });
        this.paramsEnabled = paramsEnabled;
        path = path.split('#')[1] || path;
        this.routes.push({
            name: name,
            path: path,
            callback: callback,
            paramsEnabled: paramsEnabled,
            params: params
        });
    }
}
