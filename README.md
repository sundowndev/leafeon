# router.js

Simple client based mono-page router. You don't need node, this is a entirely lightweight and front based for simple html pages. You can use it on GitHub pages for documentations or a portfolio.

## Features

* Static Route Patterns
* Dynamic Route Patterns
* Regex support
* Custom 404 error handling
* Mono-page router listening to the URI
* Before and after Router Middleware

## Overview

A simple route

~~~ js
router.match('/#/mypage', function(){
  /* do something */
});
~~~

A simple route using parameter

~~~ js
router.match('/#/category/:id', function(id){
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
window.addEventListener('hashchange', function(){
    parent.run(); // run the router again when a paramater is pushed to the URI
});
~~~

After router middleware

~~~ js
router.run(function(){
    /* do something after running the router */
});
~~~

### Dynamic route patterns

- `\d+` = One or more digits (0-9)
- `\w+` = One or more word characters (a-z 0-9 _)
- `[a-z0-9_-]+` = One or more word characters (a-z 0-9 _) and the dash (-)
- `[^/]+` = Any character but `/`, one or more

## Installation

1. Include router.js at the end of the body
2. Init the router
~~~ html
<script>
    var router = new router();
</script>
~~~
3. Create and include routes.js
