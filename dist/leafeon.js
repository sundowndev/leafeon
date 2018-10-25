"use strict";

var _this3 = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouterRequest = function RouterRequest() {
  var _this = this;

  _classCallCheck(this, RouterRequest);

  this.getURI = function () {
    if (location.hash.substr(0, 2) === '#/') {
      _this.URI = location.hash.substr(1);
    }

    return _this.URI;
  };

  this.setURI = function (route) {
    location.hash = route;
  };

  this.URI = '/' + location.hash;
};

var leafeon =
/*#__PURE__*/
function (_RouterRequest) {
  _inherits(leafeon, _RouterRequest);

  function leafeon() {
    var _this2;

    _classCallCheck(this, leafeon);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(leafeon).call(this));

    _this2.getCurrentURI = function () {
      return _this2.getURI();
    };

    _this2.setErrorCallback = function (func) {
      _this2.notFoundCallback = func;
    };

    _this2.notFoundException = function () {
      _this2.notFoundCallback.apply(null, []);
    };

    _this2.before = function (route, func) {
      _this2.BeforeRouteMiddleware = route;
      _this2.BeforeRouteMiddlewareFunc = func;
    };

    _this2.map = function (name, mount) {
      var routes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      routes.forEach(function (route) {
        _this2.add(name + route.name, mount + _this2.FormatPath(route.path, true), route.callback);
      });
    };

    _this2.fetchRoute = function (routeName, params) {
      var targetRoute = _this2.routes.find(function (route) {
        return route.name === routeName || route.path === routeName;
      });

      if (!targetRoute.paramsEnabled) {
        _this2.setURI(targetRoute.path);

        return;
      }

      if (!params) _this2.Exception('Error: route "' + routeName + '" requires some parameters. None specified.');

      var generatedURI = _this2.GenerateURL(targetRoute.path, params);

      _this2.setURI(generatedURI);
    };

    _this2.GenerateURL = function (route, params) {
      var generatedURI = route;

      var _loop = function _loop(p) {
        if (!params.hasOwnProperty(p)) return "continue";
        var paramInRoute = route.split('/').find(function (targetParam) {
          return targetParam === ':' + p;
        });
        generatedURI = generatedURI.replace(paramInRoute, params[p]);
      };

      for (var p in params) {
        var _ret = _loop(p);

        if (_ret === "continue") continue;
      }

      return generatedURI;
    };

    _this2.FormatPath = function (path) {
      var OnlySlash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (OnlySlash && path === '/') {
        path = '';
      } else if (!OnlySlash && path.substr(0, 1) === '/') {
        path = path.substr(1);
      }

      return path;
    };

    _this2.setRoute = function (route) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      _this2.route = route;
      _this2.routeCall = route.callback;
      _this2.params = params;
      _this2.notfound = false;
    };

    _this2.handle = function (routes) {
      var URI = _this2.getCurrentURI();

      routes.forEach(function (Route) {
        var RouteArray = Route.split('/');
        var URIarray = URI.split('/');

        if (URIarray.length !== RouteArray.length) {
          return;
        }

        var RouteOptions = _this2.handlingParams(Route);

        var URIstring = URIarray.join('');

        if (RouteOptions.RouteString !== URIstring) {
          return;
        }

        _this2.routes.forEach(function (route) {
          if (route.path === Route && _this2.notfound) {
            _this2.setRoute(route, RouteOptions.params);
          }
        });
      });
    };

    _this2.run = function (AfterRouteCallback) {
      var URI = _this2.getCurrentURI();

      var routes = [];
      _this2.notfound = true;

      _this2.BeforeMiddleware(_this2.BeforeRouteMiddleware, _this2.BeforeRouteMiddlewareFunc);

      _this2.routes.forEach(function (route) {
        if (route.paramsEnabled) {
          routes.push(route.path);

          _this2.handle(routes);
        } else if (route.path === URI) {
          _this2.setRoute(route);
        }
      });

      if (_this2.notfound) {
        _this2.notFoundException();
      } else {
        _this2.routeCall.apply(null, _this2.params);
      }

      if (AfterRouteCallback != null) {
        _this2.AfterRouteCallback = AfterRouteCallback;

        _this2.AfterRouteCallback.apply(null, []);
      } else if (_this2.AfterRouteCallback != null) {
        _this2.AfterRouteCallback.apply(null, []);
      }
    };

    _this2.BeforeMiddleware = function (route, callback) {
      var URI = _this2.getURI();

      switch (route.substr(0, 2)) {
        case '#/':
          route = route.substr(1);
          break;

        case '/#':
          route = route.substr(2);
          break;
      }

      if (callback != null) {
        if (route === '*') {
          callback.apply(null, []);
        } else if (route === URI) {
          callback.apply(null, []);
        }
      }
    };

    _this2.handlingParams = function (route) {
      var URIarray = _this2.getCurrentURI().split('/');

      var RouteArray = route.split('/');
      var params = [];

      for (var i = 0; i < RouteArray.length; i++) {
        if (RouteArray[i].substr(0, 1) === ':') {
          if (URIarray[i] !== '') {
            params.push(URIarray[i]);
          }

          RouteArray[i] = URIarray[i];
        }
      }

      return {
        params: params,
        RouteString: RouteArray.join('')
      };
    };

    _this2.Exception = function (message) {
      throw new TypeError(message);
    };

    _this2.notfound = false;
    _this2.routes = [];
    _this2.paramsEnabled = false;
    _this2.params = [];
    _this2.BeforeRouteMiddleware = '*';

    _this2.routeCall = function () {};

    _this2.BeforeRouteMiddlewareFunc = function () {};

    _this2.AfterRouteCallback = function () {};

    _this2.route = {};

    _this2.notFoundCallback = function () {
      throw new TypeError('404 error.');
    };

    return _this2;
  }

  _createClass(leafeon, [{
    key: "add",
    value: function add(name, path, callback) {
      var routeArray = path.split('/');
      var paramsEnabled = false,
          params = [];
      routeArray.forEach(function (r) {
        if (r.substr(0, 1) === ':') {
          paramsEnabled = true;
          params.push(r.substr(1, r.length));
        }
      });
      this.paramsEnabled = paramsEnabled;

      switch (path.substr(0, 2)) {
        case '#/':
          path = path.substr(1);
          break;

        case '/#':
          path = path.substr(2);
          break;
      }

      this.routes.push({
        name: name,
        path: path,
        callback: callback,
        paramsEnabled: paramsEnabled,
        params: params
      });
    }
  }]);

  return leafeon;
}(RouterRequest);

window.addEventListener('hashchange', function () {
  _this3.run();
});
