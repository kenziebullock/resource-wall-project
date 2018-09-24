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
    console.log(e)
    $('#search-form').slideToggle();
  });

  $('.card').mouseover(function(e){
    $(this).children('a.nav-link').removeClass('hide');
  })

  $('.card').mouseout(function(e){
    $(this).children('a.nav-link').addClass('hide');
  })

});

