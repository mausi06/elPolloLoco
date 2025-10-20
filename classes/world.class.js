/**
 * Represents the main game world, managing all game objects,
 * interactions, and the game loop.
 */
class World {
    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The canvas element for drawing.
     * @param {Keyboard} keyboard - The keyboard handler.
     */
    constructor(canvas, keyboard) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {Keyboard} */
        this.keyboard = keyboard;

        /** @type {Level} */
        this.level = createLevel1();
        /** @type {Character} */
        this.character = new Character();
        this.character.world = this;

        /** @type {number} */
        this.totalCoins = this.level.coins.length;
        /** @type {number} */
        this.totalBottles = this.level.bottles.length;
        /** @type {number} */
        this.collectedCoins = 0;
        /** @type {number} */
        this.collectedBottles = 0;

        /** @type {HealthStatusBar} */
        this.healthStatusBar = new HealthStatusBar();
        /** @type {CoinStatusBar} */
        this.coinStatusBar = new CoinStatusBar();
        this.coinStatusBar.setPercentage(0, this.totalCoins);
        /** @type {BottleStatusBar} */
        this.bottleStatusBar = new BottleStatusBar();
        this.bottleStatusBar.setPercentage(0, this.totalBottles);
        /** @type {EndbossHealthStatusBar} */
        this.endbossHealthStatusBar = new EndbossHealthStatusBar();

        /** @type {GameOver} */
        this.gameOver = new GameOver();
        /** @type {YouWin} */
        this.youWin = new YouWin();

        /** @type {boolean} */
        this.gameIsRunning = true;
        /** @type {boolean} */
        this.characterIsDead = false;
        /** @type {boolean} */
        this.gameIsWon = false;

        /** @type {HTMLAudioElement} */
        this.game_music = new Audio('audio/game-music.mp3');
        /** @type {HTMLAudioElement} */
        this.game_over_sound = new Audio('audio/game-over.mp3');
        /** @type {HTMLAudioElement[]} */
        this.sounds = [this.game_music, this.game_over_sound, this.character.walking_sound, this.character.jump_sound, this.character.hurt_sound];
        /** @type {boolean} */
        this.isMuted = false;

        /** @type {ThrowableObject[]} */
        this.throwableObjects = [];

        /** @type {CollisionManager} */
        this.collisionManager = new CollisionManager(this);

        this.setWorld();
        this.loadMuteStatus();
        this.draw();
        this.startCollisionLoop();
        if (!this.isMuted) this.game_music.play();
    }

    /**
     * Sets the 'world' property for enemies and starts the endboss logic.
     */
    setWorld() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) enemy.startLogic();
        });
    }

    /**
     * Starts the main collision loop, updating all collision checks 60 times per second.
     */
    startCollisionLoop() {
        let collisionInterval = setInterval(() => this.collisionManager.update(), 1000 / 60);
        allIntervals.push(collisionInterval);
    }

    /**
     * Main rendering loop. Draws all game objects, HUD elements, and manages the camera.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        [this.level.backgroundObjects, this.level.coins, this.level.bottles, this.throwableObjects, this.level.enemies, this.level.clouds].forEach(group => this.addObjectsToMap(group));
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        [this.healthStatusBar, this.coinStatusBar, this.bottleStatusBar].forEach(obj => this.addToMap(obj));

        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.spotCharacter && !endboss.isDead()) {
            this.endbossHealthStatusBar.setPercentage(endboss.energy);
            this.addToMap(this.endbossHealthStatusBar);
        }

        if (this.gameOver.isAnimating || this.gameOver.isAnimationComplete) {
            this.gameOver.animate();
            this.gameOver.draw(this.ctx);
        }

        if (this.youWin.isAnimating || this.youWin.isAnimationComplete) {
            this.youWin.animate();
            this.youWin.draw(this.ctx);
        }

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds multiple objects to the canvas.
     * @param {Array<DrawableObject>} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single object on the canvas, handling direction flipping if needed.
     * @param {MovableObject} mo - Object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips the object horizontally for drawing.
     * @param {MovableObject} mo - Object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas state after flipping an object.
     * @param {MovableObject} mo - Object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Toggles mute status for all game sounds.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.sounds.forEach(s => s.muted = this.isMuted);
        if (!this.isMuted && this.game_music.paused) this.game_music.play();
        document.getElementById('mute-icon').src = this.isMuted ? 'img/mute.png' : 'img/unmute.png';
        localStorage.setItem('isMusicMuted', this.isMuted);
    }

    /**
     * Loads the saved mute status from local storage and applies it.
     */
    loadMuteStatus() {
        const saved = localStorage.getItem('isMusicMuted');
        if (saved !== null) this.isMuted = saved === 'true';
        if (this.isMuted) this.game_music.pause(); else this.game_music.play();
        document.getElementById('mute-icon').src = this.isMuted ? 'img/mute.png' : 'img/unmute.png';
    }

    /**
     * Triggers the "Game Over" state when the character dies.
     * Stops the game, starts the game over animation, pauses the music,
     * and displays the end screen when the animation is complete.
     */
    triggerGameOver() {
        this.gameIsRunning = false;
        this.characterIsDead = true;

        this.gameOver.isGameOver = true;
        this.gameOver.isAnimating = true;
        this.gameOver.startAnimation();
        this.game_music.pause();
        this.game_over_sound.play();

        let interval = setInterval(() => {
            if (this.gameOver.isAnimationComplete) {
                document.getElementById('end-screen').classList.remove('hidden');
                document.getElementById('end-screen').classList.add('visible');
                clearInterval(interval);
            }
        }, 50);
    }

    /**
     * Triggers the "Game Won" state when the player defeats the endboss.
     * Stops the game, starts the win animation, pauses the music,
     * and displays the end screen when the animation is complete.
     */
    triggerGameWon() {
        this.gameIsRunning = false;
        this.gameIsWon = true;

        this.youWin.isAnimating = true;
        this.youWin.startAnimation();
        this.game_music.pause();

        let interval = setInterval(() => {
            if (this.youWin.isAnimationComplete) {
                document.getElementById('end-screen').classList.remove('hidden');
                document.getElementById('end-screen').classList.add('visible');
                clearInterval(interval);
            }
        }, 50);
    }
}
