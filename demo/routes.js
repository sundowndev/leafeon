/*
 * Router calls
 */
router.add('#/home', function(){
    /* do something */
    console.log('home!');
});

router.add('#/je/test/laroute', function(){
    /* do something */
    console.log('je test laroute');
});

router.add('#/hello/world', function(){
    console.log('hello world');
});

router.add('#/hello/:id', function(id){
    console.log('hello {{ name }}');
});

router.add('#/hello/:id/test', function(id){
    console.log('hello {{ test }}');
});

router.run(function(){
    /* Optional finish callback */
});