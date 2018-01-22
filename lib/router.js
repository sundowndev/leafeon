var router = function () {
  /*
   * Access to the main object through functions
   */
  var parent = this;

  /*
   * Router options
   */
  this.request = new Request('');
  this.notfound;
  this.routes = [];
  this.paramsEnabled = false;
  this.routeCall = function () {};
  this.params = [];
    
  this.getRequestMethod = function () {
    return parent.request.method;
  }
    
  var notFoundCallback = function  () {
      throw new TypeError('Router.js : 404 error.');
  }
  
  this.setErrorCallback = function (func) {
    notFoundCallback = func;
  }
  
  this.getCurrentURI = function () {
      return location.hash;
  }
  
  /*
   * Add route function
   */
  this.add = function (route, callback) {
      let routeArray = route.split('/');
      let paramsEnabled = false;
      let params = [];

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
  }
  
  /*
   * GoTo route function
   */
  this.goto = function (route) {
      location.hash = route;
  }
  
  /*
   * Set the route callback if it match
   */
  var setRoute = function (callback, params = []) {
      parent.routeCall = callback;
      parent.params = params;
      parent.notfound = false;
  }
  
  /*
   * Check route
   */
  this.handle = function (routes) {
      let URI = parent.getCurrentURI();

      routes.forEach(function(Route){
          let RouteArray = Route.split('/');
          let URIarray = URI.split('/');
                    
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
  }
  
  /*
   * Run the router and search for a route match
   */
  this.run = function (AfterRouteCallback = null) {
    let URI = parent.getCurrentURI();
    let routes = [];
    parent.notfound = true;
        
    parent.routes.forEach(function(route){
        if (route.paramsEnabled) {
            routes.push(route.route);
            parent.handle(routes);
        }else if (route.route === URI) {
            setRoute(route.callback);
        }
    });

    if (parent.notfound) {
        notFoundCallback();
    }else{
        parent.routeCall.apply(null, parent.params);
    }
      
    if (AfterRouteCallback != null) {
        AfterRouteCallback();
    }
  }
  
  /*
   * Listen to the URI
   */
  window.addEventListener('hashchange', function(){
      parent.run();
  });
}

var handlingParams = function (route) {
    let URIarray = router.getCurrentURI().split('/');
    let RouteArray = route.split('/');
    let params = [];
    let RouteOptions = {};
    
    for (i = 0; i < RouteArray.length; i++) {
        if(RouteArray[i].substr(0, 1) == ':'){
            if(URIarray[i] != ''){
                params.push(URIarray[i]);
                RouteArray[i] = URIarray[i];
            }
        }
    }

    RouteOptions = {
        params: params,
        RouteArray: RouteArray.join('')
    };
    
    return RouteOptions;
}
