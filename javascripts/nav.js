// Logic for navigation
const LIMIT = 500;
const MAX_MOBILE_WIDTH = 1080;

function toggleOnSideBar(setOn, delay) {
    if ($(window).width() < MAX_MOBILE_WIDTH)
        return;

    if (setOn) {
        anime({
            targets: ".article-layout-sidebar",
            opacity: 1,
            duration: delay
        });
    }
    else {
        anime({
            targets: ".article-layout-sidebar",
            opacity: 0.5,
            duration: delay
        });
    }
}

function createTableOfContents() {
    // Go through the article and grab each header.
    var maxDisplayDepth = 4;
    // Searches through all h* but may not dispaly everything.
    var searchDepths = [1, 2, 3, 4, 5, 6];

    var toc = null;
    if ($(window).width() < MAX_MOBILE_WIDTH) {
        toc = $(".mid-bar-island .table-of-contents").first();
        $(".side-bar-island .table-of-contents").hide();
        $("#table-of-contents-header").hide();
    }
    else {
        toc = $(".side-bar-island .table-of-contents").first();
        $(".mid-bar-island").hide();
    }

    toc.text("");

    var search = []
    searchDepths.forEach((v) => {
        search.push(`.article-layout-main-body h${v}`);
    });

    var typed = [];
    $(search.join(", ")).each(function() {
        for (var i = 0; i < searchDepths.length; ++i) {
            var d = searchDepths[i];
            if($(this).is(`h${d}`)) {
                typed.push([d, $(this).text(), $(this)]);
                break;
            }
        }
    })

    if (typed.length == 0) {
        toc.hide();
        $("#table-of-contents-header").hide();
        return;
    }

    // Normalize so that the largest depth is pursuied.
    var min = typed.reduce((min, value) => {return Math.min(min, value[0])}, searchDepths.length + 1);
    var subtract = min - 1;
    typed = typed.map((e) => { return [e[0] - subtract, e[1], e[2]]; });

    var context = [toc];
    typed.forEach((v) => {
        var depth = v[0];
        var text = v[1];
        var elem = v[2];

        if (context.length >= depth + 1) {
            context = context.slice(0, depth + 1);
        } else if(context.length < depth + 1) {
            var diff = depth - context.length + 1;
            var root = null;
            for (var i = 1; i < diff + 1; ++i) {
                root = context[context.length + i - 2];
                var newDom = $("<ul>")
                root.append(newDom)
                context.push(newDom)
            }
        }

        var dom = context[depth];
        var list = $("<li>");
        var href = $("<a>", {text: text})
        href.click(() => {
            elem[0].scrollIntoView();
            anime({
                targets: elem[0],
                opacity: [
                    {value: 0.2, duration: 400},
                    {value: 1, duration: 400},
                ],
                easing: "linear"
            })
        });
        list.append(href);
        dom.append(list);
    })
}


$(document).ready(() => {
    createTableOfContents();

    $(window).on("scroll", () => {
        var newScroll = $(document).scrollTop();
        toggleOnSideBar(newScroll <= LIMIT, 1000);
    })

    var sidebar = $(".article-layout-sidebar")
    sidebar.hover(
        () => {
            // Only check hover if scrolled beyond.
            if ($(document).scrollTop() > LIMIT)
                toggleOnSideBar(true, 2000);
        },
        () => {
            // Only check hover if scrolled beyond.
            if ($(document).scrollTop() > LIMIT)
                toggleOnSideBar(false, 2000);
        }
    );
});
