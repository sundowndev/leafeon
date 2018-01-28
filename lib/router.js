var router = function () {
  /*
   * Access to the main object through functions
   */
  var parent = this;

  /*
   * Router options
   */
  this.notfound;
  this.routes = [];
  this.paramsEnabled = false;
  this.routeCall = function () {};
  this.params = [];
  this.BeforeRouteMiddleware = '*';
  this.BeforeRouteMiddlewareFunc = null;
    
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
  
  /*
   * Add route function
   */
  this.add = function (route, callback) {
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
          route: route,
          callback: callback,
          paramsEnabled: paramsEnabled,
          params: params
      });
  };
  
  /*
   * GoTo route function
   */
  this.goto = function (route) {
      new RouterRequest().setURI(route);
  };
  
  /*
   * Set the route callback if it match
   */
  var setRoute = function (callback, params = []) {
      parent.routeCall = callback;
      parent.params = params;
      parent.notfound = false;
  };
  
  /*
   * Check route
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
                          setRoute(route.callback, RouteOptions.params);
                      }
                  });
              }
          }
      });
  };
  
  /*
   * Run the router and search for a route match
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
            setRoute(route.callback);
        }
    });
      
    new BeforeMiddleware(parent.BeforeRouteMiddleware, parent.BeforeRouteMiddlewareFunc);

    if (parent.notfound) {
        notFoundCallback.apply();
    }else{
        parent.routeCall.apply(null, parent.params);
    }
      
    if (AfterRouteCallback != null) {
        AfterRouteCallback.apply();
    }
  };
  
  /*
   * Listen to the URI
   */
  window.addEventListener('hashchange', function(){
      parent.run();
  });
};

var RouterRequest = function () {
    var parent = this;
    
    this.getURI = function () {
        return "/" + location.hash;
    };
    
    this.setURI = function (route) {
        location.hash = route;
    };
};

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

var handlingParams = function (route) {
    var parent = this;
    var URIarray = router.getCurrentURI().split('/');
    var RouteArray = route.split('/');
    var params = [];
    var RouteOptions = {};
    var regex = ['(\d+)', '(\w+)', '([a-z0-9_-]+)', '([^/]+)'];
    
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
