function titleMove() {
    anime({
        targets: '.pi-title-image',
        translateY: [
            {value: -100, duration: 1000},
            {value: 0, duration: 1000}
        ]
    });
}

// Returns a callable function
function button_move(target, url) {
    return function () {
        anime({
            targets: target,
            translateX: 1000
        });
        anime({
            targets: '.pi-title-image',
            translateX: [
                {value: -1000, duration: 1000},
            ]
        });

        var call = function () {
            // Hide the objects.
            $(".pi-title-image").hide();
            $(target).hide();
        };
        setTimeout(call, 100);

        // Move the title, why not.
        // Delay timeout.
        setTimeout(function(){ window.location = url; }, 150);
    }
}

$(document).ready(function(){
    // Hook up movement of title.
    $(".pi-title-image").click(titleMove);
    
    // Disable ALL links
    $("a").attr('href', "javascript: void(0)")

    // Hooks for buttons
    $(".aboutme-button").click(button_move(".title-move", "/aboutme"))
    $(".blog-button").click(button_move(".title-move", "/blog"))
});