var toggle = true;
$(document).ready(function() {
    $("body").keyup(function(e) {
        if(e.which == 84){
            if(toggle){
                $("img").fadeOut();
                toggle = false;
            }
            else{
                $("img").fadeIn();
                toggle = true;
            }
        }
    });
});