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
    let maxDisplayDepth = 4;
    // Searches through all h* but may not dispaly everything.
    let searchDepths = [1, 2, 3, 4, 5, 6];

    let toc = null;
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

    let search = []
    searchDepths.forEach((v) => {
        search.push(`.article-layout-main-body h${v}`);
    });

    let typed = [];
    $(search.join(", ")).each(function() {
        for (let i = 0; i < searchDepths.length; ++i) {
            let d = searchDepths[i];
            if($(this).is(`h${d}`)) {
                typed.push([d, $(this).text(), $(this)]);
                break;
            }
        }
    })

    if (typed.length == 0) {
        toc.hide();
        $("#table-of-contents-header").hide();
        $(".mid-bar-island").hide();
        return;
    }

    // Normalize so that the largest depth is pursuied.
    let min = typed.reduce((min, value) => {return Math.min(min, value[0])}, searchDepths.length + 1);
    let subtract = min - 1;
    typed = typed.map((e) => { return [e[0] - subtract, e[1], e[2]]; });

    let context = [toc];
    typed.forEach((v) => {
        let depth = v[0];
        let text = v[1];
        let elem = v[2];

        if (context.length >= depth + 1) {
            context = context.slice(0, depth + 1);
        } else if(context.length < depth + 1) {
            let diff = depth - context.length + 1;
            let root = null;
            for (let i = 1; i < diff + 1; ++i) {
                root = context[context.length + i - 2];
                let newDom = $("<ul>")
                root.append(newDom)
                context.push(newDom)
            }
        }

        let dom = context[depth];
        let list = $("<li>");
        let href = $("<a>", {text: text})
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

    let island = $(".side-bar-island");
    // Grab location in relative
    let origin = island.offset().top;

    // Set to absolute
    island.css({position: "fixed"})
    let newScroll = $(document).scrollTop();
    var animated = (newScroll > LIMIT);
    var animating = false;
    $(window).on("scroll", () => {
        newScroll = $(document).scrollTop();
        console.log(animating);

        if (!animated && newScroll <= LIMIT) {
            let nv = -newScroll + origin;
            island.css({top: `${nv}px`});
        } else if (!animating && animated && newScroll < 2) {
            // Reset the position and state only if we hit top.
            animated = false;
        } else if(!animating && !animated && newScroll > LIMIT) {
            animated = true;
            animating = true;
            anime({
                targets: island[0],
                top: origin,
                easing: "easeOutQuad",
                duration: 500,
                complete: (anim) => { animating = false; }
            });
        }
        toggleOnSideBar(newScroll <= LIMIT, 1000);
    })

    let sidebar = $(".article-layout-sidebar")
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
