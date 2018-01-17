var router = function () {
  /*
   * Access to the main object through functions
   */
  var parent = this;

  /*
   * Object options
   */
  this.request = new Request('');
  this.notfound;
  this.routes = [{
      GET: [],
      POST: []/*,
      PUT: [],
      DELETE: [],
      OPTIONS: [],
      PATCH: [],
      HEAD: []*/
  }];
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
   * Get method
   */
  this.match = function (method, request, callback) {
    if(parent.request.method == method){
        let requestArray = request.split('/');
        let paramsEnabled = false;
        let params = [];

        requestArray.forEach(function(e){
            if(e.substr(0, 1) == ':'){
                paramsEnabled = parent.paramsEnabled = true;
                params.push(e.substr(1, e.length));
            }
        });

        parent.routes[0][method].push({
          request: request,
          callback: callback,
          paramsEnabled: paramsEnabled,
          params: params
        });

    }
  }
  
  this.get = function (request, callback) {
    parent.match('GET', request, callback);
    //return parent;
  }
  
  this.post = function (request, callback) {
    parent.match('POST', request, callback);
    //return parent;
  }
  
  this.execRoute = function (callback, params = []) {
      callback.apply(null, params);
      parent.notfound = false;
  }
  
  this.handle = function (routes) {
      let URI = parent.getCurrentURI();
      let URIarray = URI.split('/');
      let params = [];
      
      routes.forEach(function(Route){
          let RouteArray = Route.split('/');
          
          for (i = 0; i < RouteArray.length; i++) {
              if(RouteArray[i].substr(0, 1) == ':'){
                  params.push(URIarray[i]);
                  RouteArray[i] = URIarray[i];
              }
          }
          
//          RouteArray = RouteArray.join('');
//          URIarray = URIarray.join('');
          
              console.log(RouteArray);
          if(RouteArray == URIarray){
          }
          
//          for (i = 0; i < RouteArray.length; i++) {
//              if((RouteArray[i] != '#') && (RouteArray[i] == URIarray[i])){
//                  parent.notfound = false;
//                    console.log(RouteArray);
//              }
//              
//          }
//          
//          //console.log(parent.notfound);
//          
//          if(!parent.notfound){
//             parent.routes[0][parent.request.method].forEach(function(targetRoute){
//              //console.log(targetRoute.request);
//                    if(targetRoute.request == Route && parent.notfound){
//                        parent.execRoute(targetRoute.callback, params);
//                    }
//                  });
//             }
      });
  }
  
  /*
   * Run the router and search for a route match
   */
  this.run = function (callback = null) {
    let URI = parent.getCurrentURI();
    let routes = [];
    parent.notfound = true;
    
    if(parent.paramsEnabled) {
        parent.routes[0][parent.request.method].forEach(function(route){
            if(/*route.paramsEnabled && */parent.notfound) {
                routes.push(route.request);
                parent.handle(routes);
            }/*else if(route.request === URI){
                parent.execRoute(route.callback);
            }*/
        });
    }else{
        parent.routes[0][parent.request.method].forEach(function(route){
            if(route.request === URI){
                parent.execRoute(callback);
            }
        });
    }
      
    if(parent.notfound) {
        notFoundCallback();
    }
      
    if(callback != null) {
        callback();
    }
  }
  
  /*
   * Listen to the URI
   */
  window.addEventListener('popstate', function(){
      parent.run();
  });
}