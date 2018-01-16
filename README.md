# router.js

Simple client-based JS router for a single page.

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
