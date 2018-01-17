/*
 * Router calls
 */
router.get('#/home', function(){
    /* do something */
    console.log('home!');
});

router.get('#/abcd', function(){
    /* do something */
    console.log('abcd!');
});

router.get('#/hello', function(id){
    console.log('test1!');
});

router.get('#/hello/world', function(){
    console.log('test2!');
});

router.get('#/hello/world', function(id){
    console.log('test2!');
});

router.run(function(){
    /* Optional finish callback */
});