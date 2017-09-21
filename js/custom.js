    $("#minichullo").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
});

    $("#text-menu").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
});

/* img:hover

function bloghover(element) {
    element.setAttribute('src', '/images/blog.gif');
}
function blogunhover(element) {
    element.setAttribute('src', '/images/blog.png');
}
*/

$('#blog').hover(
    function(){
      $('#blog-img').attr('src','/images/blog.gif')
    },
    function(){
      $('#blog-img').attr('src','/images/blog.png')
    }
)