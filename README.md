# router.js

<p>
  <a href="#"><img src="https://img.shields.io/github/tag/Sundowndev/router.js.svg?style=flat-square" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/size-9.9kb-brightgreen.svg?style=flat-square" alt="Size"></a>
  <a href="#"><img src="https://img.shields.io/badge/minified%20size-3.7kb-brightgreen.svg?style=flat-square" alt="Size minified"></a>
</p>

Simple client sided Javascript routing library for static websites such as documentation or personal website. See it in action [here](https://crvx.fr/)

## Features

- Static & dynamic routing
- Custom 404 error handling
- Before and after router middleware
- Prefixed route paths
- Route redirection with URL generator

## Overview

A simple route

~~~js
var router = new router();

router.add('default', '/', function () {
    /* do something */
});
~~~

A simple route using parameter

~~~js
router.add('single_category', '/category/:id', function (id) {
  console.log('You requested the category #' + id);
});
~~~

Set a callback when returning "route not found"

~~~js
router.setErrorCallback(function () {
    throw new TypeError('I think there\'s a problem.');
});
~~~

Before route middleware

~~~js
router.before('*', function () {
    /* do something each time the route change */
});
~~~

After router middleware

~~~js
router.run(function () {
    /* do something after running the router */
});
~~~

Mapping routes using a route prefix

~~~js
// This will create two routes under /#/docs prefix
router.map('docs_', '/docs', [
    {
        name: 'intro',
        route: '/',
        callback: function () {
            content.innerHTML = '' +
                '<h1>Introduction</h1>'
            ;
        }
    },
    {
        name: 'get_started',
        route: '/get-started',
        callback: function () {
            content.innerHTML = '' +
                '<h1>Get started</h1>'
            ;
        }
    }
]);
~~~

### API

Fetch a route by name or path

~~~js
router.fetchRoute('home'); // or router.fetchRoute('/');

// with parameters
router.fetchRoute('hello', {name: 'Sundown'});
~~~

Get the current route

~~~js
router.route
~~~

This will return :

~~~
{
    name: [string],
    route: [string],
    callback: [function],
    paramsEnabled: [boolean],
    params: [array]
}
~~~

Set and call the not found exception (with example)

~~~js
var projects = [{title: 'routerjs', description: 'routing library'}];

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

#### Usage

```js
var Router = require('@sundowndev/router.js');

var router = Router();

router.add('home', '/', function () {
    document.write('hello world');
});

router.run();
```


## Installation

1. Include router.js in **<head>** or at the end of the **<body>**

~~~html
<script src="router.js"></script>

<!-- or via jsdelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/sundowndev/router.js@latest/dist/router.min.js"></script>
~~~

2. Init the router

~~~html
<script>
    var router = new router();
</script>

~~~

3. Create some routes

~~~js
router.add('home', '/', function () {
    document.write('Hello!');
});
~~~

4. Run the router

~~~js
router.run();
~~~

## License

This repository is MIT licensed.
