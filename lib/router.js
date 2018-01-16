var router = function () {
  var parent = this;
    
  this.notfound;
  this.routes = [];
    
  var ErrorCallback = function() {
      throw new TypeError('Router.js : 404 error.');
  }
  
  this.setErrorCallback = function (func) {
    ErrorCallback = func;
  }
  
  this.getCurrentURI = function () {
      return location.hash;
  }
  
  this.get = function (request, callback) {
    parent.routes.push({
      request: request,
      callback: callback
    });
  }
  
  this.run = function () {
    let URI = parent.getCurrentURI();
    parent.notfound = true;
      
    parent.routes.forEach(function(route){
        if(route.request === URI){
            route.callback();
            parent.notfound = false;
        }
    });
      
    if(parent.notfound){
        ErrorCallback();
    }
  }
  
  window.addEventListener('popstate', function(){
      parent.run();
  });
}