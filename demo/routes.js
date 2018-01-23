var content = document.querySelector('#content');

/*
 * Router calls
 */
router.add('/', function () {
    content.textContent = 'home';
});

router.add('/#/about', function () {
    content.textContent = 'about me';
});

router.add('/#/hello/world', function () {
    content.textContent = 'hello world :)';
});

router.add('/#/hello/:name', function (name) {
    content.textContent = 'hello ' + name;
});

router.add('/#/user/([a-zA-Z_-])', function (name) {
    content.textContent = 'user: ' + name;
});

router.setErrorCallback(function () {
    content.textContent = '404 error!';
    throw new TypeError('404 error');
});

router.run(function () { /* Optional finish callback */ });