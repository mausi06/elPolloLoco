let canvas;
let world;
let keyboard = new Keyboard();
let allIntervals = []; // Array zum Speichern aller Intervall-IDs
let isGameStarted = false; // Neue Variable, um den Spielstatus zu verfolgen

/**
 * Checks if the panel should be visible based on screen size and game status.
 */
function checkPanelVisibility() {
    let panel = document.getElementById('panel');
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    if (isGameStarted && isTouchDevice) {
        panel.style.display = 'flex';
    } else {
        panel.style.display = 'none';
    }
}

/**
 * Initializes the game and creates a new World object.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * This function is triggered by the "Start Game" button.
 * It hides the start screen, sets the game status, and initializes the game.
 */
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    isGameStarted = true;
    checkPanelVisibility(); // Überprüfe Sichtbarkeit beim Start
    init();
    document.getElementById('mute-button').style.display = 'flex';
    if (!world.isMuted) {
        world.game_music.play();
    }
}

/**
 * Restarts the game by resetting all game states and showing the start screen.
 */
function restartGame() {
    allIntervals.forEach(interval => clearInterval(interval));
    allIntervals = [];

    world = null;
    keyboard = new Keyboard();

    isGameStarted = false;
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('end-screen').classList.remove('visible');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('panel').style.display = 'none';
    document.getElementById('mute-button').style.display = 'none';

    let youWin = new YouWin();
    youWin.isGameWon = false;
    youWin.isAnimating = false;
    youWin.isAnimationComplete = false;

    let canvas = document.getElementById('canvas');
    if (canvas) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Waits for the DOM to be fully loaded before adding event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Füge den Resize-Event-Listener hinzu, um die Sichtbarkeit kontinuierlich zu prüfen
    window.addEventListener('resize', checkPanelVisibility);

    document.getElementById('btn-left').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    document.getElementById('btn-left').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('btn-right').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    document.getElementById('btn-right').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    }); 

    document.getElementById('btn-jump').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.UP = true;
    });
    document.getElementById('btn-jump').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.UP = false;
    });

    document.getElementById('btn-throw').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    document.getElementById('btn-throw').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });

    window.addEventListener("keydown", (e) => {
        if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
            e.preventDefault();
        }
        if (e.keyCode == 39) { 
            keyboard.RIGHT = true;
        }
        if (e.keyCode == 37) {
            keyboard.LEFT = true;
        }
        if (e.keyCode == 38) { 
            keyboard.UP = true;
        }
        if (e.keyCode == 40) {
            keyboard.DOWN = true;
        }
        if (e.keyCode == 32) {
            keyboard.SPACE = true;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.keyCode == 39) {
            keyboard.RIGHT = false;
        }
        if (e.keyCode == 37) {
            keyboard.LEFT = false;
        }
        if (e.keyCode == 38) {
            keyboard.UP = false;
        }
        if (e.keyCode == 40) {
            keyboard.DOWN = false;
        }
        if (e.keyCode == 32) {
            keyboard.SPACE = false;
        }
    });
});
