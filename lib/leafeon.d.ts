interface route {
    name: string;
    path: string;
    callback: void;
    paramsEnabled?: boolean;
    params?: Array<string>;
}
/**
 * @class RouterRequest
 */
declare class RouterRequest {
    URI: string;
    constructor();
    /**
     * @function getURI
     * @returns {string}
     */
    getURI: () => string;
    /**
     * @function    setURI
     * @param route string
     */
    setURI: (route: string) => void;
}
/**
 * @package leafeon
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export declare class router extends RouterRequest {
    private notfound;
    private routeCall;
    private params;
    private BeforeRouteMiddleware;
    private BeforeRouteMiddlewareFunc;
    private AfterRouteCallback;
    private notFoundCallback;
    route: object;
    routes: Array<route>;
    paramsEnabled: boolean;
    constructor();
    /**
     * @function setErrorCallback
     * @param func
     */
    setErrorCallback: (func: any) => this;
    /**
     * @function notFoundException
     */
    notFoundException: () => void;
    /**
     * @function before
     *
     * Before route function
     *
     * @param route
     * @param func
     */
    before: (route: string, func: any) => this;
    /**
     * @function add
     * @param {string} name
     * @param {string} path
     * @param callback
     */
    add: (name: string, path: string, callback: any) => this;
    /**
     * @function map
     *
     * Mapping routes into a specific path
     *
     * @param name
     * @param mount
     * @param routes
     */
    map: (name: string, mount: string, routes: any[]) => this;
    /**
     * @function fetchRoute
     *
     * Target a given route by name or path
     *
     * @param Route
     * @param params
     */
    fetchRoute: (Route: string, params: string[]) => void;
    /**
     * @function generateURL
     *
     * Generate URL from route and parameters
     *
     * @param route
     * @param params
     * @returns string
     */
    private generateURL;
    /**
     * @function FormatPath
     *
     * Format given path
     *
     * @param path
     * @param OnlySlash
     */
    private FormatPath;
    /**
     * @function setRoute
     *
     * Set the route callback if it match
     *
     * @param route
     * @param params
     */
    private setRoute;
    /**
     * @function handle
     *
     * Check route
     *
     * @param routes
     */
    private handle;
    /**
     * @function handlingParams
     * @param {string} route
     * @returns {object}
     */
    private handlingParams;
    /**
     * @function run
     *
     * Run the router and search for a route match
     *
     * @param AfterRouteCallback
     */
    run: (AfterRouteCallback?: any) => void;
    /**
     * @function BeforeMiddleware
     * @param {string} route
     * @param callback
     */
    private BeforeMiddleware;
    /**
     * @function Exception
     * @param {string} message
     * @returns {never}
     */
    private Exception;
}
export {};
