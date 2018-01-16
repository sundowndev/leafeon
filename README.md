# router.js

Simple client based mono-page JS router. You don't need node, this is a entirely lightweight front based for simple html pages. You can use it on GitHub pages for documentations or a portfolio for example.

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

## Installation

1. include router.js
2. init the router
~~~ js
<script>
    var router = new router();
</script>
~~~
3. create and include routes.js