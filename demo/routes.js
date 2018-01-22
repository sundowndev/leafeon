/*
 * Router calls
 */
router.add('', function(){
    /* do something */
    console.log('root');
});

router.add('#/home', function(){
    /* do something */
    console.log('home');
});

router.add('#/hello/world', function(){
    console.log('hello world :)');
});

router.add('#/hello/:name', function(name){
    console.log('hello ' + name);
});

router.add('#/:name/is/here', function(name){
    console.log(name + ' is here!');
});

router.add('#/lol/:name/:token', function(name, token){
    console.log(name + ' is here ' + token);
});

router.run(function(){
    /* Optional finish callback */
});