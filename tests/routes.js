/*
 * Router calls
 */
router.get('#/home', function(){
  console.log('home!');
});

router.get('#/contact', function(){
  /* do something */
  console.log('contact!');
});

router.run();