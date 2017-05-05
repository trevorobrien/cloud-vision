$(function() {

  var WIN = $(window);
  var DOC = $(document);
  var BODY = $("body");

  var _winW;
  var _winH;

  var teams = []

  $('.js-logo').each(function(){
    teams.push($(this).data('team'))
  })

  var teamNum = Math.floor(Math.random() * teams.length);
  var team = teams[teamNum];
  $('.js-logo').eq(teamNum).css({
    visibility: 'visible'
  })
  $('.js-video-'+team.toLowerCase()).css({
    display: 'block'
  })

  $('h1').each(function(i){
    $('span', this).each(function(j) {
      $(this).css({
        transitionDelay: .1 + Math.random()/3 + 's'
      })
    })
  })

  WIN.on('touchstart',function(){
    isTouchDevice = true;
  })

  resizeHandler();
// EVENTS
/////////

  // UTIL EVENTS
  WIN.on('resize',resizeHandler);

// FUNCTIONS
////////////

  setTimeout(function(){
    $('.js-logo').addClass('in')
  },1000)
  function scrollHandler() {

  }

  function resizeHandler () { // Set the size of images and preload them
    _winW = window.innerWidth;
    _winH = window.innerHeight;
  }

})
