/**
 * Generic game loader for "Push to Play" functionality.
 * Handles dynamic module loading, UI state, and responsive canvas scaling.
 * 
 * @param {Object} options 
 * @param {string} options.modulePath - Path to the game's JS module (e.g., '/games/game.js')
 * @param {string} options.containerId - ID of the container element (default: 'game-container')
 * @param {string} options.buttonId - ID of the push-to-play button (default: 'push-to-play')
 * @param {string} options.gameId - ID of the div where the canvas will be moved (default: 'game')
 * @param {string} options.canvasSelector - CSS selector for the canvas element (default: 'canvas')
 * @param {number} options.nativeWidth - Native width for scaling (default: 1024)
 * @param {number} options.initDelay - Delay in ms after init() before scaling (default: 500)
 */
export async function setupPushToPlay(options) {
    const config = {
        containerId: 'game-container',
        buttonId: 'push-to-play',
        gameId: 'game',
        canvasSelector: 'canvas',
        nativeWidth: 1024,
        initDelay: 500,
        ...options
    };

    let initialized = false;

    async function start_game() {
        if (initialized) return;
        initialized = true;

        const $button = $(`#${config.buttonId}`);
        const $container = $(`#${config.containerId}`);
        const $gameDiv = $(`#${config.gameId}`);

        $button.text("LOADING...");

        try {
            // Dynamically import the game module
            const module = await import(config.modulePath);
            const init = module.default;

            // Initialize the game engine
            try {
                await init();
            } catch (e) {
                // Some game engines (like Bevy/Wasm) use exceptions for control flow.
                // We check if this is a "false" error.
                if (e && e.message && e.message.includes("Using exceptions for control flow")) {
                    console.info("Game engine used an exception for control flow. Proceeding...");
                } else {
                    throw e; // Re-throw real errors
                }
            }

            // Allow time for the engine to settle and create the canvas
            await new Promise(resolve => setTimeout(resolve, config.initDelay));

            $button.hide();
            $container.css({ "background": "none", "cursor": "default" });

            const setCanvas = () => {
                const $canvas = $(config.canvasSelector);
                if ($canvas.length === 0) {
                    // Poll for canvas if not immediately available
                    setTimeout(setCanvas, 100);
                    return;
                }
                
                $canvas.detach();
                $gameDiv.append($canvas);

                const updateScale = () => {
                    const $body = $(".article-layout-main-body");
                    const availableWidth = $body.width() - 24;
                    const ratio = availableWidth / config.nativeWidth;
                    
                    $canvas.css({
                        "transform-origin": "0 0",
                        "transform": `scale(${ratio})`,
                    });

                    const scaledHeight = $canvas.height() * ratio;
                    const scaledWidth = $canvas.width() * ratio;

                    $gameDiv.height(scaledHeight);
                    $gameDiv.width(scaledWidth);
                    $container.css("aspect-ratio", "auto");
                    $container.height(scaledHeight);
                };

                updateScale();
                
                // Handle window resize for responsiveness
                $(window).off(`resize.${config.containerId}`).on(`resize.${config.containerId}`, updateScale);
            };

            setCanvas();

        } catch (e) {
            console.error("Failed to load game:", e);
            $button.text("ERROR LOADING GAME (Click to retry)");
            initialized = false;
        }
    }

    $(document).ready(() => {
        $(`#${config.containerId}`).on("click", start_game);
    });
}
