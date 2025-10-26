let canvas;
let world;
let keyboard = new Keyboard();
let allIntervals = [];
let isGameStarted = false;

/**
 * Checks if the touch control panel should be visible 
 * based on the current game state and whether the device supports touch.
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
 * Initializes the game world.
 * Sets up the canvas and creates a new {@link World} instance with the keyboard controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Starts the game.
 * 
 * - Hides the start screen.
 * - Sets the game state to "started".
 * - Initializes the world.
 * - Displays the mute button.
 * - Plays background music (if not muted).
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
 * Restarts the game by resetting all variables and intervals.
 * 
 * - Clears active intervals.
 * - Resets world and keyboard instances.
 * - Resets UI elements (start, end, mute, and touch panels).
 * - Clears the canvas.
 * - Resets win/lose state animations.
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
 * Initializes all event listeners once the DOM is fully loaded.
 * 
 * - Adds window resize listener to check panel visibility.
 * - Initializes keyboard and touch input handlers.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', checkPanelVisibility);
    initTouchControls(keyboard);
    initKeyboardControls(keyboard);
});

/**
 * Initializes keyboard controls for desktop users.
 * 
 * @param {Keyboard} keyboard - The keyboard input handler instance.
 * 
 * Maps specific key codes to movement or action states and updates the 
 * {@link Keyboard} instance accordingly on `keydown` and `keyup` events.
 */
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

/**
 * Initializes touch controls for mobile and tablet devices.
 * 
 * @param {Keyboard} keyboard - The keyboard input handler instance.
 * 
 * Binds touch events (`touchstart`, `touchend`) to the on-screen control buttons.
 * When a button is pressed, it sets the corresponding keyboard property to `true` or `false`.
 */
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
