var content = document.querySelector('#content');

var router = new router();

/*
 * Routes calls
 */
router.before('*', function () {
    console.log('before middleware');
});

router.add('home', '/', function () {
    content.textContent = 'home';
});

router.add('about', '/#/about', function () {
    content.textContent = 'about me';
});

router.add('hello', '/#/hello/:name', function (name) {
    content.textContent = 'hello ' + name + ' !';
});

router.add('contact', '/#/contact', function () {
    content.textContent = 'contact';
});

router.setErrorCallback(function () {
    content.textContent = '404 error!';
    throw new TypeError('404 error');
});

router.run(function () {
    document.getElementById(router.route.name).classList.toggle('active');
});