# router.js

<p>
  <a href="#"><img src="https://img.shields.io/github/tag/Sundowndev/router.js.svg" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/size-8.0kb-brightgreen.svg?style=flat" alt="Size"></a>
  <a href="#"><img src="https://img.shields.io/badge/minified%20size-4.0kb-brightgreen.svg?style=flat" alt="Size minified"></a>
</p>

Simple client sided router. You don't need node, you can use it in static html pages for documentation, personal website etc.

## Features

- Static & dynamic route patterns
- Custom 404 error handling
- Before and after router middleware
- Prefixing route paths

## Overview

A simple route

~~~ js
var router = new router();

router.add('default', '/', function () {
    /* do something */
});
~~~

A simple route using parameter

~~~ js
router.add('single_category', '/category/:id', function (id) {
  console.log('You requested the category #' + id);
});
~~~

Set a callback when returning "route not found"

~~~ js
router.setErrorCallback(function () {
    throw new TypeError('I think there\'s a problem.');
});
~~~

Before route middleware

~~~ js
router.before('*', function () {
    /* do something each time the route change */
});
~~~

After router middleware

~~~ js
router.run(function () {
    /* do something after running the router */
});
~~~

Mapping routes using a route prefix

~~~js
// This will create two routes under /#/docs prefix
router.map('page_', '/docs', [
    {
        name: 'index',
        route: '/',
        callback: function () {
            content.innerHTML = '' +
                '<h1>index page</h1>'
            ;
        }
    },
    {
        name: 'tutorial',
        route: '/tutorial',
        callback: function () {
            content.innerHTML = '' +
                '<h1>This is a tutorial!</h1>'
            ;
        }
    }
]);
~~~

### Using npm

```js
var Router = require('@sundowndev/router.js');

var router = Router();

router.add('home', '/', function () {
    console.log('hello world');
});

router.run();
```

### API

Fetch a route by name or path

~~~ js
router.fetchRoute('home'); // or router.fetchRoute('/');
~~~

Get the current route

~~~js
router.route
~~~

This will ouput :

~~~
{
    name: "home",
    route: "/",
    callback: [function],
    paramsEnabled: false,
    params: []
}
~~~

Set and call the not found exception (with example)

~~~js
var projects = [{title: 'routerjs', description: 'ayyy'}];

//overwrite the default not found exception
router.setErrorCallback(function () {
    document.write('Oh no! Page not found.');
});

router.add('projects', '/projects/:title', function (sProjectTitle) {
    //search for the object in array
    let oProject = projects.find(function (project) { sProjectTitle === project.title });

    //if the project does not exist
    if (!oProject) {
        router.notFoundException();
    }
});
~~~

## Installation (npm)

~~~bash
$ npm i @sundowndev/router.js
~~~

## Installation

1. Include router.js at the end of the body

~~~html
<script src="router.js"></script>
~~~

or via jsdelivr's CDN

~~~html
<script src="https://cdn.jsdelivr.net/gh/sundowndev/router.js@<VERSION>/dist/router.min.js"></script>
~~~

2. Init the router

~~~html
<script>
    var router = new router();
</script>

~~~

3. Create some routes and run the router

~~~js
router.add('home', '/', function () {
    content.innerHTML = '' +
        '<div>' +
            '<h1>Welcome!</h1>' +
            '<p>wow, such routing</p>' +
        '</div>'
    ;
});

router.run();
~~~

## License

This repository is MIT licensed.
