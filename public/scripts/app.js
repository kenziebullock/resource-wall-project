// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;

// });

$(document).ready(function(){
  $('i[data-likes]').on('click', function() {
    
    const likeState = { resource_id: $(this).attr('data-likes') };
    $.ajax({
      url: `/resources/${$(this).attr('data-likes')}/like`, 
      data: likeState,
      method: 'POST'
    }).then((increment) => {
      const $like = $(this).next()
      $like.text(Number($like.text()) + increment.increment);
    })
  });
});

