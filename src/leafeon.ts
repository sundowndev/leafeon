interface route {
    name: string,
    path: string,
    callback: void,
    paramsEnabled?: boolean,
    params?: Array<string>
}

/**
 * @class RouterRequest
 */
class RouterRequest {
    URI: string;

    constructor() {
        this.URI = this.getURI();
    }

    /**
     * @function getURI
     * @returns {string}
     */
    public getURI = (): string => {
        return this.URI = window.location.href.split('#')[1] || '/';
    };

    /**
     * @function    setURI
     * @param route string
     */
    public setURI = (route: string): void => {
        window.location.hash = route;
    };
}

/**
 * @package leafeon
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export class router extends RouterRequest {
    private notfound: boolean;
    private routeCall: any;
    private params: Array<string>;
    private BeforeRouteMiddleware: string;
    private BeforeRouteMiddlewareFunc: any;
    private AfterRouteCallback: any;
    private notFoundCallback: any;
    public route: object;
    public routes: Array<route>;
    public paramsEnabled: boolean;

    constructor() {
        super();

        this.notfound = false;
        this.routes = [];
        this.paramsEnabled = false;
        this.params = [];
        this.BeforeRouteMiddleware = '*';
        this.routeCall = () => {};
        this.BeforeRouteMiddlewareFunc = () => {};
        this.AfterRouteCallback = () => {};
        this.route = {};
        this.notFoundCallback = () => {
            throw new TypeError('Route not found');
        };

        window.onpopstate = () => {
            this.run();
        };
    }

    /**
     * @function setErrorCallback
     * @param func
     */
    public setErrorCallback = (func: any): void => {
        this.notFoundCallback = func;
    };

    /**
     * @function notFoundException
     */
    public notFoundException = (): void => {
        this.notFoundCallback.apply(null, []);
    };

    /**
     * @function before
     *
     * Before route function
     *
     * @param route
     * @param func
     */
    public before = (route: string, func: any): void => {
        this.BeforeRouteMiddleware = route;
        this.BeforeRouteMiddlewareFunc = func;
    };

    /**
     * @function add
     * @param {string} name
     * @param {string} path
     * @param callback
     */
    public add = (name: string, path: string, callback: any): void => {
        const routeArray = path.split('/');

        let paramsEnabled = false,
            params: Array<string> = [];

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

    /**
     * @function map
     *
     * Mapping routes into a specific path
     *
     * @param name
     * @param mount
     * @param routes
     */
    public map = (name: string, mount: string, routes: any[]): void => {
        routes.forEach((route: route) => {
            this.add(name + route.name, mount + this.FormatPath(route.path, true), route.callback);
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
    public fetchRoute = (Route: string, params: Array<string>): void => {
        const targetRoute = this.routes.find((route: route) => {
            return route.name === Route || route.path === Route;
        });

        if (targetRoute == undefined){
            return this.Exception('Route ' + Route + ' does not exist.');
        }

        if (!targetRoute.paramsEnabled) {
            this.setURI(targetRoute.path);
            return;
        }

        if (!params) this.Exception('Error: route "' + Route + '" requires some parameters. None specified.');

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
    private generateURL = (route: string, params: Array<string>): string => {
        let generatedURI = route;

        for (let p in params) {
            const paramInRoute = route.split('/').find((targetParam): boolean => {
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
     * @param path
     * @param OnlySlash
     */
    private FormatPath = (path: string, OnlySlash = false): string => {
        if (OnlySlash && path === '/') {
            path = '';
        } else if (!OnlySlash && path.substr(0, 1) === '/') {
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
    private setRoute = (route: route, params: Array<string> = []): void => {
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
     * @param routes
     */
    private handle = (routes: Array<route>): void => {
        const URI = this.getURI();

        routes.forEach((route) => {
            const RouteArray = route.path.split('/');
            let URIarray: Array<string> = URI.split('/');

            if (URIarray.length !== RouteArray.length) {
                return;
            }

            const RouteOptions: any = this.handlingParams(route.path);

            if (RouteOptions.RouteString === URI && this.notfound) {
                return this.setRoute(route, RouteOptions.params);
            }
        });
    };

    /**
     * @function handlingParams
     * @param {string} route
     * @returns {object}
     */
    private handlingParams = (route: string): object => {
        const URIarray = this.getURI().split('/');
        const RouteArray = route.split('/');
        const params: Array<string> = [];

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
    public run = (AfterRouteCallback?: any): void => {
        const URI = this.getURI();
        let routes: Array<any> = [];

        // While a route has not match the URI, set page as not found
        this.notfound = true;

        // Call before middleware
        this.BeforeMiddleware(this.BeforeRouteMiddleware, this.BeforeRouteMiddlewareFunc);

        this.routes.forEach((route) => {
            if (route.paramsEnabled) {
                routes.push(route);
                this.handle(routes);
            } else if (route.path === URI) {
                this.setRoute(route);
            }
        });

        // If there's a route match, execute the callback
        if (this.notfound) {
            this.notFoundException();
        } else {
            this.routeCall.apply(null, this.params);
        }

        // Call after middleware
        if (AfterRouteCallback != null) {
            this.AfterRouteCallback = AfterRouteCallback;
            this.AfterRouteCallback.apply(null, []);
        } else if (this.AfterRouteCallback != null) {
            this.AfterRouteCallback.apply(null, []);
        }
    };

    /**
     * @function BeforeMiddleware
     * @param {string} route
     * @param callback
     */
    private BeforeMiddleware = (route: string, callback: any) => {
        route = route.split('#')[1] || route;

        if (callback != null) {
            if (route === '*') {
                return callback.apply(null, []);
            } else if (route === this.getURI()) {
                return callback.apply(null, []);
            }
        }
    };

    /**
     * @function Exception
     * @param {string} message
     * @returns {never}
     */
    private Exception = (message: string): never => {
        throw new TypeError(message);
    };
}
