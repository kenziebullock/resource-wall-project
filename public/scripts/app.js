$(document).ready(function(){

  $('i[data-likes]').on('click', function() {
    
    const likeState = { resource_id: $(this).attr('data-likes') };
    $.ajax({
      url: `/resources/${$(this).attr('data-likes')}/like`, 
      data: likeState,
      method: 'POST'
    }).then((response) => {
      if(response.url) {
        // window.location.href = response.url
      } else {
        const $like = $(this).next()
        $like.text(Number($like.text()) + response.increment);
      }
    })
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

  });
});

