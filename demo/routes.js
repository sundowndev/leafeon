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

router.add('about', '/#/about', function (about) {
    content.innerHTML = '' +
        '<h1>About me</h1>' +
        '<p>I\'m french</p>'
    ;

    router.fetchRoute('test', {id: 1});
});

router.add('contact', '/contact', function () {
    content.innerHTML = '' +
        '<h1>Contact me</h1>' +
        '<p>You can contact me at <strong>raphael(at)crvx[.]fr</strong></p>'
    ;
});

router.add('test', '/projet/:id', function (id) {
    content.innerHTML = '' +
        '<h1>' + id + '</h1>'
    ;
});

router.setErrorCallback(function () {
    content.textContent = 'Woups, 404 error!';
    throw new TypeError('404 error');
});

router.run(function () {
    console.log('You are now on ' + router.route.route + ' route');

    let links = document.querySelectorAll('[data-router-link]');

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            router.fetchRoute(link.dataset.routerLink);
        });

        if (link.dataset.routerLink === router.route.name) {
            link.classList.toggle('active');
        } else {
            link.classList.remove('active');
        }
    });
});