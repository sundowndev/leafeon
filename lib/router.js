var router = function () {
  var parent = this;
  
  this.routes = {};
  var ErrorCallback = function() {}
  
  this.getCurrentURI = function () {}
  
  var end = function () {
    //let currentURI = parent.getCurrentURI();
    //callback();
  }
  
  this.setErrorCallback = function (func) {
    ErrorCallback = func;
  }
  
  this.get = function (request, callback) {
    parent.routes.push({
      request: request,
      callback: callback
    });
  }
}
