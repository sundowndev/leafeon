import { router } from '../dist/leafeon';

var leafeon = new router();

leafeon.before('*', () => { /* do something each time the route change */ });

leafeon.add('home', '/', () => document.body.innerHTML = 'hello world');

leafeon.map('tutorial_', '/tutorial', [
    {
        name: 'hello',
        path: '/:name',
        callback: (name) => document.body.innerHTML = 'Hey ' + name + ' !'
    },
    {
        name: 'get_started',
        path: '/get-started',
        callback: () => leafeon.fetchRoute('tutorial_hello', {name: 'Raphael'})
    }
]);

leafeon.setErrorCallback(() => {
    document.body.innerHTML = 'Error: route not found';

    throw new TypeError('I think we\'ve got a problem.');
});

leafeon.run(() => { console.log(leafeon.route); });