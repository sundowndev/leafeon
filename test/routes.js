//var leafeon = require('../src/leafeon');
import Leafeon from '../src/leafeon';

var router = new Leafeon();

router.before('*', () => { /* do something each time the route change */ });

router.add('home', '/', () => document.write('hello world'));

router.map('docs_', '/docs', [
    {
        name: 'intro',
        route: '/',
        callback: () => {
            content.innerHTML = '' +
                '<h1>Introduction</h1>'
            ;
        }
    },
    {
        name: 'get_started',
        route: '/get-started',
        callback: () => router.fetchRoute('hello', {name: 'Sundown'})
    }
]);

router.setErrorCallback(() => {
    throw new TypeError('I think there\'s a problem.');
});

router.run(() => { /* do something after running the router */ });