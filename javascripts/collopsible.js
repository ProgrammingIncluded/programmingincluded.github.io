$(document).ready(function() {
    const headingSelector = 'h1, h2, h3, h4, h5, h6';
    const triggerClass = 'collapsible-trigger';
    const contentClass = 'collapsible-content';
    const lastInGroupClass = 'last-in-group';
    const activeClass = 'active';
    const iconClass = 'toggle-icon';

    // Keep track of the actual H5 elements that became triggers
    let $triggers = $(); // Empty jQuery collection to store triggers

    // --- First Pass: Create Collapsibles ---
    $('h5').each(function() {
        const $h5 = $(this);
        const $contentToWrap = $h5.nextUntil(headingSelector);

        if ($contentToWrap.length > 0) {
            // Wrap the content
            $contentToWrap.wrapAll(`<div class="${contentClass}"></div>`);
            const $collapsibleDiv = $h5.next(`div.${contentClass}`);

            // Hide content initially
            $collapsibleDiv.hide();

            // Style the trigger H5
            $h5.addClass(triggerClass).css('cursor', 'pointer');
            $h5.prepend(`<span class="${iconClass}">+</span> `);

            // Add this H5 to our collection of triggers
            $triggers = $triggers.add($h5);

            // Attach click event listener
            $h5.on('click', function() {
                const $clickedH5 = $(this);
                const $contentDiv = $clickedH5.next(`div.${contentClass}`);

                $contentDiv.slideToggle();
                $clickedH5.toggleClass(activeClass);

                const $icon = $clickedH5.find(`.${iconClass}`);
                $icon.text($clickedH5.hasClass(activeClass) ? '- ' : '+ ');
            });
        }
    });

    // --- Second Pass: Add Spacing After Last in Group ---
    // Iterate through only the H5 elements that actually became triggers
    $triggers.each(function() {
        const $h5Trigger = $(this);
        const $contentDiv = $h5Trigger.next(`div.${contentClass}`);

        // Ensure the content div exists (it should, as it's a trigger)
        if ($contentDiv.length > 0) {
            // Find the very next sibling element after the content div
            const $nextElement = $contentDiv.next();

            // Check if it's the last collapsible in a sequence of H5 triggers.
            // It's the last if:
            // 1. There is no next element OR
            // 2. The next element exists but is NOT an H5 that is ALSO a trigger.
            //    We check against our collected $triggers list.
            if ($nextElement.length === 0 || !$nextElement.is($triggers)) {
                 // Add the specific class to the content div for CSS styling
                 $h5Trigger.addClass(lastInGroupClass); // Added this line
            }
        }
    });
});
