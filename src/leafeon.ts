/**
 * @class RouterRequest
 */
class RouterRequest {
    URI: string;

    constructor() {
        this.URI = '/' + location.hash;
    }

    protected getURI = () => {
        if (location.hash.substr(0, 2) === '#/') {
            this.URI = location.hash.substr(1);
        }

        return this.URI;
    };

    /**
     * @function    setURI set the current URI
     * @param route string
     */
    public setURI = (route: string) => {
        location.hash = route;
    };
}

/**
 * leafeon class
 *
 * @package leafeon
 * @version 2.0.1
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
class leafeon extends RouterRequest {
    notfound: boolean;
    routes: Array<route>;
    paramsEnabled: boolean;
    routeCall: any;
    params: Array<string>;
    BeforeRouteMiddleware: string;
    BeforeRouteMiddlewareFunc: any;
    AfterRouteCallback: any;
    route: object;
    notFoundCallback: any;

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
            throw new TypeError('404 error.');
        };
    }

    private getCurrentURI = () => {
        return this.getURI();
    };

    public setErrorCallback = (func) => {
        this.notFoundCallback = func;
    };

    public notFoundException = () => {
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
    public before = (route: string, func: any) => {
        this.BeforeRouteMiddleware = route;
        this.BeforeRouteMiddlewareFunc = func;
    };

    public add(name: string, path: string, callback: any): void {
        const routeArray = path.split('/');
        let paramsEnabled = false,
            params: Array<string> = [];

        routeArray.forEach(function (r) {
            if (r.substr(0, 1) === ':') {
                paramsEnabled = true;
                params.push(r.substr(1, r.length));
            }
        });

        this.paramsEnabled = paramsEnabled;

        switch (path.substr(0, 2)) {
            case '#/':
                path = path.substr(1);
                break;
            case '/#':
                path = path.substr(2);
                break;
        }

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
     * @param name  string
     * @param mount string
     * @param routes    array
     */
    public map = (name: string, mount: string, routes = []): void => {
        routes.forEach((route) => {
            this.add(name + route.name, mount + this.FormatPath(route.path, true), route.callback);
        });
    };

    /**
     * @function fetchRoute
     *
     * Target a given route by name or path
     *
     * @param routeName string
     * @param params    array
     */
    public fetchRoute = (routeName: string, params: Array<string>): void => {
        const targetRoute = this.routes.find((route: route) => {
            return route.name === routeName || route.path === routeName;
        });

        if (!targetRoute.paramsEnabled) {
            this.setURI(targetRoute.path);
            return;
        }

        if (!params) this.Exception('Error: route "' + routeName + '" requires some parameters. None specified.');

        let generatedURI = this.GenerateURL(targetRoute.path, params);

        this.setURI(generatedURI);
    };

    /**
     * @function GenerateURL
     *
     * Generate URL from route and parameters
     *
     * @param route
     * @param params
     * @returns string
     */
    private GenerateURL = (route: string, params: Array<string>): string => {
        let generatedURI = route;

        for (let p in params) {
            if (!params.hasOwnProperty(p)) continue;

            const paramInRoute = route.split('/').find((targetParam): boolean => {
                return targetParam === ':' + p;
            });

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
     * @param route string
     * @param params    array
     */
    private setRoute = (route, params = []): void => {
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
    private handle = (routes: Array<any>): void => {
        const URI = this.getCurrentURI();

        routes.forEach((Route) => {
            const RouteArray = Route.split('/');
            let URIarray: Array<string> = URI.split('/');

            if (URIarray.length !== RouteArray.length) {
                return;
            }

            const RouteOptions: any = this.handlingParams(Route);

            const URIstring: string = URIarray.join('');

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
    public run = (AfterRouteCallback?: any): void => {
        const URI = this.getCurrentURI();
        let routes: Array<string> = [];

        // While a route has not match the URI, page is not found
        this.notfound = true;

        this.BeforeMiddleware(this.BeforeRouteMiddleware, this.BeforeRouteMiddlewareFunc);

        this.routes.forEach((route) => {
            if (route.paramsEnabled) {
                routes.push(route.path);
                this.handle(routes);
            } else if (route.path === URI) {
                this.setRoute(route);
            }
        });

        if (this.notfound) {
            this.notFoundException();
        } else {
            this.routeCall.apply(null, this.params);
        }

        if (AfterRouteCallback != null) {
            this.AfterRouteCallback = AfterRouteCallback;
            this.AfterRouteCallback.apply(null, []);
        } else if (this.AfterRouteCallback != null) {
            this.AfterRouteCallback.apply(null, []);
        }
    };

    private BeforeMiddleware = (route: string, callback: any) => {
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
            } else if (route === URI) {
                callback.apply(null, []);
            }
        }
    };

    private handlingParams = (route: string): object => {
        const URIarray = this.getCurrentURI().split('/');
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
            RouteString: RouteArray.join('')
        };
    };

    private Exception = (message: string): never => {
        throw new TypeError(message);
    };
}

window.addEventListener('hashchange', () => {
    this.run();
});

interface route {
    name: string,
    path: string,
    callback: void,
    paramsEnabled?: boolean,
    params?: Array<string>
}

//module.exports = leafeon;