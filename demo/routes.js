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

router.add('#/([a-zA-Z_-])', function(name){
    console.log(name + ' ' + token);
});

router.run(function(){
    /* Optional finish callback */
});