/**
 * @class RouterRequest
 */
declare class RouterRequest {
    URI: string;
    constructor();
    getURI: () => string;
    /**
     * @function    setURI set the current URI
     * @param route string
     */
    setURI: (route: string) => void;
}
/**
 * leafeon class
 *
 * @package leafeon
 * @version 2.0.4
 * @description Client-sided and dependency-free Javascript routing library
 * @license MIT
 */
export declare class router extends RouterRequest {
    private notfound;
    private routes;
    private paramsEnabled;
    private routeCall;
    private params;
    private BeforeRouteMiddleware;
    private BeforeRouteMiddlewareFunc;
    private AfterRouteCallback;
    private route;
    private notFoundCallback;
    constructor();
    private getCurrentURI;
    setErrorCallback: (func: any) => void;
    notFoundException: () => void;
    /**
     * @function before
     *
     * Before route function
     *
     * @param route   string
     * @param func    object
     */
    before: (route: string, func: any) => void;
    add(name: string, path: string, callback: any): void;
    /**
     * @function map
     *
     * Mapping routes into a specific path
     *
     * @param name  string
     * @param mount string
     * @param routes    array
     */
    map: (name: string, mount: string, routes?: never[]) => void;
    /**
     * @function fetchRoute
     *
     * Target a given route by name or path
     *
     * @param Route string
     * @param params    array
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
     * @param path  string
     * @param OnlySlash boolean
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
     * @param routes    array
     */
    private handle;
    /**
     * @function run
     *
     * Run the router and search for a route match
     *
     * @param AfterRouteCallback    function
     */
    run: (AfterRouteCallback?: any) => void;
    private BeforeMiddleware;
    private handlingParams;
    private Exception;
}
export {};
