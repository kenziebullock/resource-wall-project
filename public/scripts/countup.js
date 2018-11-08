$(document).ready(function(){
  $('.counter').each(function () {
    let $this = $(this);


  const countTo = $this.attr('data-count');

    $({ countNum: $this.text() }).animate({
      countNum: countTo,
    },

    {

      duration: 3000,
      easing: 'linear',
      step() {
        $this.text(Math.floor(this.countNum));
      },
      complete() {
        $this.text(this.countNum);
      },
    });
  });
})
