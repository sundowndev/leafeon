# router.js

<p>
  <a href="http://travis-ci.org/SundownDEV/router.js"><img src="https://api.travis-ci.org/SundownDEV/router.js.svg?branch=master" alt="Build Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/version-1.2.0-lightgrey.svg?style=flat" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/size-8.0kb-brightgreen.svg?style=flat" alt="Size"></a>
  <a href="#"><img src="https://img.shields.io/badge/size%20minified-4.0kb-brightgreen.svg?style=flat" alt="Size minified"></a>
</p>

Simple client based router. You don't need node, this is a entirely front based for simple html pages. You can use it on GitHub pages for documentation, portfolio ...

## Features

- [x] Static Route Patterns
- [x] Dynamic Route Patterns
- [x] Custom 404 error handling
- [x] Mono-page router listening to the URI
- [x] Before and after Router Middleware
- [ ] Multiple before route middleware handling
- [ ] Support "/" and "/#/" base route at the same time
- [x] Mapping routes into a specific path

## Overview

A simple route

~~~ js
router.add('mypage', '/mypage', function () { /* do something */ });
~~~

A simple route using parameter

~~~ js
router.add('single_category', '/category/:id', function (id) {
  console.log(id);
});
~~~

Set a callback when returning "route not found"

~~~ js
router.setErrorCallback(function () {
    throw new TypeError('I think there\'s a problem.');
});
~~~

The router is always listening to URI

~~~ js
window.addEventListener('hashchange', function () {
    parent.run(); // run the router again when a paramater is pushed to the URI
});
~~~

After router middleware

~~~ js
router.run(function () {
    /* do something after running the router */
});
~~~

Target a specific route by name

~~~ js
router.setRoute('home');
~~~

Before route middleware

~~~ js
router.before('*', function () {
    /* do something each time the url change */
});

router.before('/#/about', function () {
    /* do something each time the URI change to "/#/about" */
});
~~~

Access to the current route

~~~js
router.route
~~~

This will ouput :

~~~
{name: "home", route: "/", callback: [function], paramsEnabled: false, params: [array]}
~~~

Route mapping

~~~js
// This will create two routes under /#/page prefix
router.map('/#/page', [
    {
        name: 'home',
        route: '/',
        callback: function () {
            // show me home content
        }
    },
    {
        name: 'about',
        route: '/',
        callback: function () {
            // show me about content
        }
    }
]);
~~~

## Installation

1. Include router.js at the end of the body

2. Init the router

~~~ html
<script>
    var router = new router();
</script>Notifications @SundownDEV

~~~

3. Create routes and run the router

~~~ js
router.add('home', '/', function () {
    content.innerHTML = '' +
        '<h1>Welcome!</h1>' +
        '<p>wow, such routing</p>'
    ;
});

router.run();
~~~
