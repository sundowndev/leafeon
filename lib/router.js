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
    
  this.getRequestMethod = function () {
    return parent.request.method;
  }
    
  var notFoundCallback = function() {
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
  this.add = function (request, callback) {
      let requestArray = request.split('/');
      let paramsEnabled = false;
      let params = [];

      requestArray.forEach(function(e){
          if(e.substr(0, 1) == ':'){
            paramsEnabled = parent.paramsEnabled = true;
            params.push(e.substr(1, e.length));
          }
      });

      parent.routes.push({
          request: request,
          callback: callback,
          paramsEnabled: paramsEnabled,
          params: params
      });
  }
  
  /*
   * Execute the route callback if it match
   */
  var execute = function (callback, params = []) {
      callback.apply(null, params);
      parent.notfound = false;
  }
  
  /*
   * Check route
   */
  this.handle = function (routes) {
      let URI = parent.getCurrentURI();
      let URIarray = URI.split('/');
      let params = [];
      
      
      routes.forEach(function(Route){
          let RouteArray = Route.split('/');
          
          if (URIarray.length == RouteArray.length && parent.notfound) {

              for (i = 0; i < RouteArray.length; i++) {
                  if(RouteArray[i].substr(0, 1) == ':'){
                      params.push(URIarray[i]);
                      RouteArray[i] = URIarray[i];
                  }else if (RouteArray[i] == URIarray[i]) {
                      //console.log('te');
                  }
              }

              RouteArray = RouteArray.join('');
              URIarray = URIarray.join('');


              if(RouteArray == URIarray){
                  parent.routes.forEach(function(route){
                      if (route.request == Route) {
                          execute(route.callback);
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
      
    //console.log(parent.routes);
    
    parent.routes.forEach(function(route){
        if (route.paramsEnabled) {
            routes.push(route.request);
            parent.handle(routes);
        }else if (route.request === URI) {
            execute(route.callback);
        }
    });
      
    if (parent.notfound) {
        notFoundCallback();
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