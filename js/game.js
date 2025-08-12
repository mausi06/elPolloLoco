let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    console.log('My Character is;', world.character);

    // NEU: Event-Listener für den mobilen Wurf-Button
    const throwButton = document.getElementById('mobile-throw-button');
    if (throwButton) {
        throwButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Verhindert unerwünschtes Verhalten des Browsers
            keyboard.SPACE = true;
        });

        throwButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard.SPACE = false;
        });
    }
}

/**
 * This function is triggered by the "Start Game" button.
 * It hides the start screen and initializes the game.
 */
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    init();
}

/**
 * Listens for keydown events and sets the corresponding
 * keyboard property to true.
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) { // right arrow
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) { // left arrow
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) { // up arrow
        keyboard.UP = true;
    }
    if (e.keyCode == 40) { // down arrow
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) { // Space key
        keyboard.SPACE = true;
    }
});

/**
 * Listens for keyup events and sets the corresponding
 * keyboard property to false.
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) { // right arrow
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) { // left arrow
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) { // up arrow
        keyboard.UP = false;
    }
    if (e.keyCode == 40) { // down arrow
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) { // Space key
        keyboard.SPACE = false;
    }
});
