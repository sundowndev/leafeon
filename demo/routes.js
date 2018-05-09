var router = new router();

/*
 * Routes calls
 */
router.before('*', function () {
    console.log('You were on ' + router.route.route + ' route');
});

router.add('home', '/', function () {
    content.innerHTML = '' +
        '<h1>Welcome!</h1>' +
        '<p>wow, such routing</p>'
    ;
});

router.add('about', '/#/about', function () {
    content.innerHTML = '' +
        '<h1>About me</h1>' +
        '<p>I\'m french</p>'
    ;
});

router.add('contact', '/contact', function () {
    content.innerHTML = '' +
        '<h1>Contact me</h1>' +
        '<p>You contact me at <strong>raphael at crvx dot fr</strong></p>'
    ;
});

router.map('doc_', '/doc', [
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

router.setErrorCallback(function () {
    content.textContent = 'Woups, 404 error!';
    throw new TypeError('404 error');
});

router.run(function () {
    console.log('You are now on ' + router.route.route + ' route');

    var links = document.querySelectorAll('[data-router-link]');

    links.forEach(function (link) {
        if (link.dataset.routerLink === router.route.name) {
            link.classList.toggle('active');
        } else {
            link.classList.remove('active');
        }
    });
});