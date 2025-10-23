let canvas;
let world;
let keyboard = new Keyboard();
let allIntervals = [];
let isGameStarted = false;

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
    checkPanelVisibility();
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
    window.addEventListener('resize', checkPanelVisibility);

    initTouchControls(keyboard);
    initKeyboardControls(keyboard);
});

function initKeyboardControls(keyboard) {
    const keyMap = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
        32: 'SPACE'
    };

    window.addEventListener("keydown", (e) => {
        if (keyMap[e.keyCode]) {
            e.preventDefault();
            keyboard[keyMap[e.keyCode]] = true;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (keyMap[e.keyCode]) {
            e.preventDefault();
            keyboard[keyMap[e.keyCode]] = false;
        }
    });
}

function initTouchControls(keyboard) {
    const buttons = [
        { id: 'btn-left', key: 'LEFT' },
        { id: 'btn-right', key: 'RIGHT' },
        { id: 'btn-jump', key: 'UP' },
        { id: 'btn-throw', key: 'SPACE' },
    ];

    buttons.forEach(({ id, key }) => {
        const btn = document.getElementById(id);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[key] = true;
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[key] = false;
        });
    });
}