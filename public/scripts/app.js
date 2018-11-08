$(document).ready(function(){

  $('i[data-likes]').on('click', function() {

    const likeState = { resource_id: $(this).attr('data-likes') };
    $.ajax({
      url: `/resources/${$(this).attr('data-likes')}/like`,
      data: likeState,
      method: 'POST'
    }).then((response) => {
      if(response.message) {
        const $message = $('<div />').addClass('alert alert-danger').text(response.message).attr('role', 'alert');
        $($message).attr('id', 'err-like-message')
        $(this).before($message);
        setTimeout(function() {
          $('#err-like-message').fadeOut(1500, function() {
            $(this).remove();
          });
        }, 1000)
      } else {
        const $like = $(this).next()
        const likeCount = $like.text(Number($like.text()) + response.increment);
        if(likeCount.text() > 0) {
          $(this).addClass('fa').removeClass('far');
        } else {
          $(this).addClass('far').removeClass('fa');
        }
      }
    })
    // this will prevent going back to the top of the page
    return false;
  });

  $(function () {
    $('[data-toggle="popover"]').popover()
  })

  $('#search-icon').click(function(e){
    e.preventDefault()
    $('#search-form').slideToggle();
  });

  $('.card').mouseover(function(e){
    $(this).children('a.nav-link').removeClass('hide');
  })

  $('.card').mouseout(function(e){
    $(this).children('a.nav-link').addClass('hide');
  })

  /* show top element when load */
  $('.hideme').each( function(i){
      
    var top_of_object = $(this).offset().top;
    // + $(this).outerHeight();
    var bottom_of_window = $(window).scrollTop() + $(window).height();
    
    /* If the object is completely visible in the window, fade it it */
    if( bottom_of_window > top_of_object ){
        
        $(this).removeClass('hideme');       
    }    
  }); 

  // animate loading 
  $(window).scroll( function(){

    /* Check the location of each desired element */
    $('.hideme').each( function(i){
        
        var middle_of_object = $(this).offset().top + $(this).outerHeight() / 2;
        var bottom_of_window = $(window).scrollTop() + $(window).height();
        
        /* If the object is completely visible in the window, fade it it */
        if( bottom_of_window > middle_of_object ){
            
            $(this).animate({'opacity':'1'},500);
                
        }
        
    }); 

    // toggle back-to-top bottom based on y-value
    if($(window).scrollTop() > $(window).height()){
      $('.back-to-top').fadeIn()
    }else {
      $('.back-to-top').fadeOut()
    }

  });

  

  $(".back-to-top").on('click', function(event) {

    $('html, body').animate({
      scrollTop: 0
    }, 400)

  });
});

