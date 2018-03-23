/**
 * Router.js
 *
 * @author SundownDEV   https://github.com/SundownDEV
 * @version 1.1.0
 * @description Simple front based mono-page router
 * @licence MIT
 */
var router = function () {
      /**
       * Access to the main object through functions
       * @type {router}
       */
      var parent = this;

      /**
       * Route options
       *
       * @type {boolean}
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

      var notFoundCallback = function  () {
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
          var routeArray = route.split('/');
          var paramsEnabled = false;
          var params = [];

          routeArray.forEach(function(e){
              if(e.substr(0, 1) == ':'){
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
     * Map routes into a specific path
     *
     * @param name  string
     * @param mount string
     * @param routes    array
     */
    this.map = function (name, mount, routes = []) {
        // TODO
    }

    /**
     * GoTo route function
     *
     * @param route string
     */
    this.goto = function (route) {
          new RouterRequest().setURI(route);
      };

    /**
     * Set the route callback if it match
     *
     * @param route string
     * @param params    array
     */
    var setRoute = function (route, params = []) {
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
          var URI = parent.getCurrentURI();

          routes.forEach(function(Route){
              var RouteArray = Route.split('/');
              var URIarray = URI.split('/');

              if (URIarray.length == RouteArray.length) {
                  RouteOptions = new handlingParams(Route);

                  URIarray = URIarray.join('');

                  if(RouteOptions.RouteArray == URIarray){
                    parent.routes.forEach(function(route){
                        if (route.route == Route && parent.notfound) {
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
        var URI = parent.getCurrentURI();
        var routes = [];

        parent.notfound = true;

        parent.routes.forEach(function(route){
            if (route.paramsEnabled) {
                routes.push(route.route);
                parent.handle(routes);
            }else if (route.route === URI) {
                setRoute(route);
            }
        });

        new BeforeMiddleware(parent.BeforeRouteMiddleware, parent.BeforeRouteMiddlewareFunc);

        if (parent.notfound) {
            notFoundCallback.apply();
        }else{
            parent.routeCall.apply(null, parent.params);
        }

        if (AfterRouteCallback != null) {
            parent.AfterRouteCallback = AfterRouteCallback;
        } else if (parent.AfterRouteCallback != null) {
            parent.AfterRouteCallback.apply();
        }
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
var RouterRequest = function () {
    var parent = this;

    this.getURI = function () {
        return "/" + location.hash;
    };
    
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
var BeforeMiddleware = function (route, callback) {
    var parent = this;

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
var handlingParams = function (route) {
    var parent = this;

    var URIarray = router.getCurrentURI().split('/');
    var RouteArray = route.split('/');
    var params = [];
    var RouteOptions = {};

    /**
     * Handling route parameters
     *
     * @param param
     */
    this.pushParam = function (param) {
        if(param != ''){
            params.push(param);
        }
    };
    
    for (i = 0; i < RouteArray.length; i++) {
        if(RouteArray[i].substr(0, 1) == ':'){
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
