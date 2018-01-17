# router.js

Simple client based mono-page router. You don't need node, this is a entirely lightweight and front based for simple html pages. You can use it on GitHub pages for documentations or a portfolio.

## Features

* Static Route Patterns
* Dynamic Route Patterns
* Custom 404 error handling
* Supports GET and POST HTTP methods
* Mono-page router listening to the URI
* After Router Middleware (Finish Callback)

## Overview

Get the current URI

~~~ js
router.getCurrentURI();
~~~

A simple route

~~~ js
router.get('/#/mypage', function(){
  /* do something */
});
~~~

A simple route using parameter

~~~ js
router.get('/#/category/:id', function(id){
  console.log(id);
});
~~~

Set a callback when returning "route not found"

~~~ js
router.setErrorCallback(function(){
    throw new TypeError('I think there\'s a problem.');
});
~~~

The router is always listening to URI

~~~ js
window.addEventListener('popstate', function(){
    parent.run(); // run the router again when a paramater is pushed to the URI
});
~~~

## Installation

1. Include router.js at the end of the body
2. Init the router
~~~ html
<script>
    var router = new router();
</script>
~~~
3. Create and include routes.js
