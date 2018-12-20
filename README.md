<p align="center">
  <img src="https://i.imgur.com/oIbG1gB.png" />
</p>

<p align="center">
  <a href="https://travis-ci.org/sundowndev/leafeon"><img src="https://api.travis-ci.org/sundowndev/leafeon.svg?branch=master" alt="Build status"></a>
  <a href="https://coveralls.io/github/sundowndev/leafeon?branch=master"><img src="https://coveralls.io/repos/github/sundowndev/leafeon/badge.svg?branch=master" alt="Code coverage"></a>
  <a href="https://github.com/sundowndev/leafeon/releases"><img src="https://img.shields.io/github/tag/Sundowndev/leafeon.svg?style=flat-square" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/minified%20size-4kb-brightgreen.svg?style=flat-square" alt="Size minified"></a>
</p>

<p align="center">As light as a leaf, leafeon is a Javascript routing library that fits perfectly with client-side templating.</p>

## Features

- Dynamic routing & URL generator
- Error handling
- Before and after router middleware
- Route mapping

## Overview

A simple route

~~~js
leafeon.add('default', '/', function () {
    /* do something */
});
~~~

A simple route using parameter

~~~js
leafeon.add('single_category', '/category/:id', function (id) {
  console.log('You requested the category #' + id);
});
~~~

Register a callback when route is not found. It returns router object.

~~~js
leafeon.setErrorCallback(function () {
    throw new TypeError('I think there\'s a problem.');
});
~~~

Mapping routes using a route prefix

~~~js
// This will create two routes under /docs prefix
leafeon.map('docs_', '/docs', [
    {
        name: 'intro', // will be registered as docs_intro
        path: '/',
        callback: () => { document.write('Hey! Welcome.') }
    },
    {
        name: 'get_started',
        path: '/get-started', // will be registered as /#/docs/get-started
        callback: getStartedAction()
    }
]);
~~~

### API

#### `.add(name: string, path: string, callback: function)`

Register a route. Use `:` in path to create a parameter. It returns the router object.

#### `.map(prefixName: string, prefixPath: string, routes: Array)`

Register several routes using a prefix name and path. Routes must be an array of object that follows this schema :

~~~
{
  name: string,
  path: string,
  callback: function
}
~~~

#### `.fetchRoute(name: string[, parameters: object])`

Fetch a registered route by name or path. For dynamic routes, It'll generate the path using given parameters.

~~~js
leafeon.fetchRoute('home'); // or .fetchRoute('/');

// with parameters
leafeon.fetchRoute('/hello/:name', {name: 'Sundown'});
~~~

#### `.route: object`

Get the current route :

~~~
{
    name: string,
    path: string,
    callback: function,
    paramsEnabled: boolean,
    params: array
}
~~~

#### `.setErrorCallback(callback: function)`

Set the not found exception. It returns the router object.

Example :

~~~js
// overwrite the default not found exception
leafeon.setErrorCallback(function () {
    document.write('Oh no! Page not found.');
});
~~~

#### `.notFoundException()`

Call the not found exception callback.

#### `.before(path: string, callback: function)`

Register a middleware that will be executed before given path. Type **`*`** to target every routes. It returns the router object.

#### `.run([callback: function])`

Run the router with registered routes. Optionally, register a middleware that will be executed after every routes callback.

## Installation (npm)

~~~bash
$ npm i leafeon
~~~

#### Usage

```js
const leafeon = require('leafeon').Router();

leafeon.add('home', '/', function () {
    document.write('hello world');
}).run();
```

## Browser usage

1. Include leafeon.js in **<head>** or at the end of the **<body>**

~~~html
<script src="leafeon.min.js"></script>

<!-- or via jsdelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/sundowndev/leafeon@latest/dist/leafeon.min.js"></script>
~~~

2. Init the router

~~~html
<script>
    const leafeon = new leafeon.Router();
</script>
~~~

3. Create some routes and run the router

~~~js
leafeon
    .add('home', '/', () => { /* ... */ })
    .add('contact', '/contact', () => { /* ... */ })
    .setErrorCallback(() => { /* ... */ })
    .run();
~~~

## Browser support

Supports IE 11+, Chrome 43+, Opera 29+, and Firefox 41+

## License

This repository is MIT licensed.

Icon made by [Good Ware](https://www.flaticon.com/authors/good-ware) from [Flaticon](https://www.flaticon.com) under CC 3.0 BY license.
