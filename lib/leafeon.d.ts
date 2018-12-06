interface IRoute {
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
    windowObj: any;
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
    /**
     * @function    setURI
     * @param route string
     */
    windowListener: (callback: Function) => void;
}
/**
 * @package leafeon
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export declare class Router extends RouterRequest {
    private notfound;
    private routeCall;
    private params;
    private beforeRouteMiddleware;
    private beforeRouteMiddlewareFunc;
    private afterRouteCallback;
    private notFoundCallback;
    route: object;
    routes: Array<IRoute>;
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
     * @description Before route function
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
     * @description Mapping routes into a specific path
     * @param name
     * @param mount
     * @param routes
     */
    map: (name: string, mount: string, routes: any[]) => this;
    /**
     * @function fetchRoute
     * @description Target a given route by name or path
     * @param route
     * @param params
     */
    fetchRoute: (route: string, params: string[]) => void;
    /**
     * @function generateURL
     * @description Generate URL from route and parameters
     * @param route
     * @param params
     * @returns string
     */
    private generateURL;
    /**
     * @function formatPath
     * @description Format given path
     * @param path
     */
    private formatPath;
    /**
     * @function setRoute
     * @description Set the route callback if it match
     * @param route
     * @param params
     */
    private setRoute;
    /**
     * @function handle
     * @description Check route
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
     * @description Run the router and search for a route match
     * @param afterRouteCallback
     */
    run: (afterRouteCallback?: any) => void;
    /**
     * @function beforeMiddleware
     * @param {string} route
     * @param callback
     */
    private beforeMiddleware;
    /**
     * @function exception
     * @param {string} message
     * @returns {never}
     */
    private exception;
}
export {};
