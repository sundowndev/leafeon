/**
 * Router.js
 *
 * @author SundownDEV   https://github.com/SundownDEV
 * @version 1.2.0
 * @description Simple front based mono-page router
 * @license MIT
 */
var router = function () {
      /**
       * Access to the main object through functions
       * @type {router}
       */
      const parent = this;

      /**
       * Route options
       */
      this.notfound = true;
      this.routes = [];
      this.paramsEnabled = false;
      this.routeCall = function () {};
      this.params = [];
      this.BeforeRouteMiddleware = '*';
      this.BeforeRouteMiddlewareFunc = null;
      this.AfterRouteCallback = null;
      this.route = {};

      let notFoundCallback = function  () {
          throw new TypeError('Router.js : 404 error.');
      };

      this.setErrorCallback = function (func) {
        notFoundCallback = func;
      };

      this.getCurrentURI = function () {
          return new RouterRequest().getURI();
      };

      /*
       * Before route function
       */
      this.before = function (route, func) {
          parent.BeforeRouteMiddleware = route;
          parent.BeforeRouteMiddlewareFunc = func;
      };

      /**
       * Add route function
       *
       * @param name  string
       * @param route string
       * @param callback  function
       */
      this.add = function (name, route, callback) {
          let routeArray = route.split('/');
          let paramsEnabled = false;
          let params = [];

          routeArray.forEach(function(e){
              if(e.substr(0, 1) === ':'){
                paramsEnabled = parent.paramsEnabled = true;
                params.push(e.substr(1, e.length));
              }
          });

          parent.routes.push({
              name: name,
              route: route,
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
     * @param mount string
     * @param routes    array
     */
    this.map = function (mount, routes = []) {
        routes.forEach(function (route) {
            parent.add(route.name, mount + parent.FormatPath(route.route, true), route.callback);
        });
    };

    /**
     * @function setRoute
     *
     * @param routeName string
     */
    this.setRoute = function (routeName) {
        let targetRoute = parent.routes.find(function (route) {
            return route.name === routeName;
        });

        if (targetRoute.route !== undefined) {
            new RouterRequest().setURI(parent.FormatPath(targetRoute.route));
        }
      };

    /**
     * Format given path
     *
     * @param path  string
     * @param OnlySlash boolean
     */
    this.FormatPath = function (path, OnlySlash = false) {
        if (OnlySlash && path === '/') {
            path = '';
        } else if (!OnlySlash && path.substr(0, 1) === '/') {
            path = path.substr(1);
        };

        return path;
    };

    /**
     * Set the route callback if it match
     *
     * @param route string
     * @param params    array
     */
    let setRoute = function (route, params = []) {
          parent.route = route;
          parent.routeCall = route.callback;
          parent.params = params;
          parent.notfound = false;
      };

    /**
     * Check route
     *
     * @param routes    array
     */
    this.handle = function (routes) {
          let URI = parent.getCurrentURI();

          routes.forEach(function(Route){
              let RouteArray = Route.split('/');
              let URIarray = URI.split('/');

              if (URIarray.length === RouteArray.length) {
                  RouteOptions = new handlingParams(Route);

                  URIarray = URIarray.join('');

                  if(RouteOptions.RouteArray === URIarray){
                    parent.routes.forEach(function(route){
                        if (route.route === Route && parent.notfound) {
                              setRoute(route, RouteOptions.params);
                          }
                      });
                  }
              }
          });
      };

    /**
     * Run the router and search for a route match
     *
     * @param AfterRouteCallback    function
     */
    this.run = function (AfterRouteCallback = null) {
        let URI = parent.getCurrentURI();
        let routes = [];

        /**
         * While a route has not match the URI, page is not found
         *
         * @var notfound
         * @type {boolean}
         */
        parent.notfound = true;

        new BeforeMiddleware(parent.BeforeRouteMiddleware, parent.BeforeRouteMiddlewareFunc);

        parent.routes.forEach(function(route){
            if (route.paramsEnabled) {
                routes.push(route.route);
                parent.handle(routes);
            }else if (route.route === URI) {
                setRoute(route);
            }

        });

        if (parent.notfound) {
            notFoundCallback.apply();
        }else{
            parent.routeCall.apply(null, parent.params);
        };

        if (AfterRouteCallback != null) {
            parent.AfterRouteCallback = AfterRouteCallback;
            parent.AfterRouteCallback.apply();
        } else if (parent.AfterRouteCallback != null) {
            parent.AfterRouteCallback.apply();
        };
    };

    /**
     * Listen to the URI
     */
    window.addEventListener('hashchange', function(){
          parent.run();
    });
};

/**
 * @constructor BeforeMiddleware
 *
 * @function    getURI get the current URI
 * @function    setURI set the current URI
 */
let RouterRequest = function () {
    let parent = this;

    this.location = window.location.origin + window.location.pathname;

    this.getURI = function () {
        return "/" + location.hash;
    };

    /**
     * Set the new URI
     * @param route string  Must match "#/{name}"
     */
    this.setURI = function (route) {
        location.hash = route;
    };
};

/**
 * @constructor BeforeMiddleware
 *
 * @param route string
 * @param callback  function
 */
let BeforeMiddleware = function (route, callback) {
    let parent = this;

    this.route = route;
    this.callback = callback;
    this.URI = new RouterRequest().getURI();
        
    if (this.callback != null) {
        if (this.route == '*') {
            this.callback.apply();
        }else if (this.route == this.URI) {
            this.callback.apply();
        }
    }
};

/**
 * @constructor handlingParams
 *
 * @param route string
 * @returns {{ params: Array, RouteArray: string }}
 */
let handlingParams = function (route) {
    let parent = this;

    let URIarray = router.getCurrentURI().split('/');
    let RouteArray = route.split('/');
    let params = [];

    /**
     * Handling route parameters
     *
     * @param param
     */
    this.pushParam = function (param) {
        if(param !== ''){
            params.push(param);
        }
    };
    
    for (i = 0; i < RouteArray.length; i++) {
        if(RouteArray[i].substr(0, 1) === ':'){
            parent.pushParam(URIarray[i]);
            RouteArray[i] = URIarray[i];
        }
    };

    RouteOptions = {
        params: params,
        RouteArray: RouteArray.join('')
    };

    return RouteOptions;
};
