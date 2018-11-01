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
        this.URI = '/' + location.hash;
    }

    public getURI = (): string => {
        if (location.hash.substr(0, 2) === '#/') {
            this.URI = location.hash.substr(1);
        }

        return this.URI;
    };

    /**
     * @function    setURI set the current URI
     * @param route string
     */
    public setURI = (route: string): void => {
        location.hash = route;
    };
}

/**
 * leafeon class
 *
 * @package leafeon
 * @version 2.0.7
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export class router extends RouterRequest {
    private notfound: boolean;
    private routes: Array<route>;
    private paramsEnabled: boolean;
    private routeCall: any;
    private params: Array<string>;
    private BeforeRouteMiddleware: string;
    private BeforeRouteMiddlewareFunc: any;
    private AfterRouteCallback: any;
    private route: object;
    private notFoundCallback: any;

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

        window.addEventListener('hashchange', () => {
            this.run();
        });
    }

    private getCurrentURI = (): string => {
        return this.getURI();
    };

    public setErrorCallback = (func: any): void => {
        this.notFoundCallback = func;
    };

    public notFoundException = (): void => {
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
    public before = (route: string, func: any): void => {
        this.BeforeRouteMiddleware = route;
        this.BeforeRouteMiddlewareFunc = func;
    };

    public add(name: string, path: string, callback: any): void {
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
     * @param name  string
     * @param mount string
     * @param routes    array
     */
    public map = (name: string, mount: string, routes = []): void => {
        routes.forEach((route: route) => {
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
    public fetchRoute = (Route: string, params: Array<string>): void => {
        const targetRoute = this.routes.find((route: route) => {
            return route.name === Route || route.path === Route;
        });

        if (targetRoute == undefined){
            this.Exception('Route ' + Route + ' does not exist.');
            return;
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
            if (!params.hasOwnProperty(p)) continue;

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
     * @param route
     * @param params
     */
    private setRoute = (route: route, params = []): void => {
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
