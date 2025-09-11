/**
 * Represents the main game world, managing all game objects,
 * interactions, and the game loop.
 */
class World {
    /** @type {Level} The current game level, containing enemies, clouds, and background objects. */
    level;
    
    /** @type {Character} The main character controlled by the player. */
    character;
    
    /** @type {HTMLCanvasElement} The HTML canvas element for drawing the game. */
    canvas;
    
    /** @type {CanvasRenderingContext2D} The 2D rendering context of the canvas. */
    ctx;
    
    /** @type {Keyboard} The keyboard input handler. */
    keyboard;
    
    /** @type {number} The x-coordinate of the camera, used for moving the view. */
    camera_x = 0;

    /** @type {HealthStatusBar} Status bar for the character's health. */
    healthStatusBar;
    
    /** @type {CoinStatusBar} Status bar for the collected coins. */
    coinStatusBar;
    
    /** @type {BottleStatusBar} Status bar for the collected bottles. */
    bottleStatusBar;
    
    /** @type {EndbossHealthStatusBar} Status bar for the Endboss's health. */
    endbossHealthStatusBar;

    /** @type {number} The total number of coins in the level. */
    totalCoins;
    
    /** @type {number} The number of coins the character has collected. */
    collectedCoins = 0;
    
    /** @type {number} The total number of bottles in the level. */
    totalBottles;
    
    /** @type {number} The number of bottles the character has collected. */
    collectedBottles = 0;

    /** @type {boolean} Flag to determine if the game is currently running. */
    gameIsRunning = true;
    
    /** @type {boolean} Flag to track if the character has died. */
    characterIsDead = false;
    
    /** @type {boolean} Flag to determine if the game has been won. */
    gameIsWon = false;

    /** @type {GameOver} The screen displayed when the game is over. */
    gameOver;
    
    /** @type {YouWin} The screen displayed when the player wins. */
    youWin;
    
    /** @type {ThrowableObject[]} An array of bottles that have been thrown. */
    throwableObjects = [];

    /** @type {HTMLAudioElement} The game's background music. */
    game_music = new Audio('audio/game-music.mp3');
    
    /** @type {HTMLAudioElement} The sound played when the game is over. */
    game_over_sound = new Audio('audio/game-over.mp3');

    isMuted = false;

    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The canvas element for drawing.
     * @param {Keyboard} keyboard - The keyboard handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.level = createLevel1();
        this.character = new Character();

        this.totalCoins = this.level.coins.length;
        this.collectedCoins = 0;
        this.totalBottles = this.level.bottles.length;
        this.collectedBottles = 0;

        this.healthStatusBar = new HealthStatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.coinStatusBar.setPercentage(0, this.totalCoins);

        this.bottleStatusBar = new BottleStatusBar();
        this.bottleStatusBar.setPercentage(0, this.totalBottles);

        this.endbossHealthStatusBar = new EndbossHealthStatusBar();

        this.gameOver = new GameOver();
        this.youWin = new YouWin();

        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.game_music.play();
    }

    /**
     * Sets the 'world' property for the character and enemies,
     * providing them a reference to the main World object.
     * This is crucial for their interactions within the game.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.startLogic();
            }
        });
    }

    /**
     * Continuously checks for various collisions and game state changes
     * at a set interval.
     */
    /**
 * Continuously checks for various collisions and game state changes
 * at a set interval.
 */
checkCollisions() {
    let collisionInterval = setInterval(() => {
        if (this.gameIsRunning) {
            this.checkCharacterState();
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkThrowAction();
            this.checkThrowableCollisions();
        }
        this.checkEndbossState();
    }, 200);

    allIntervals.push(collisionInterval);
}

//---

/**
 * Checks if the character is dead and triggers the game over state.
 */
checkCharacterState() {
    if (this.character.isDead() && !this.characterIsDead) {
        this.triggerGameOver();
    }
}

//---

/**
 * Checks for collisions between the character and all enemies.
 */
checkEnemyCollisions() {
    if (!this.characterIsDead) {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (this.character.speedY < 0 && this.character.y + this.character.height > enemy.y + 20) {
                    enemy.hit();
                    this.character.jump();
                } else if (enemy instanceof Endboss) {
                    let timeSinceLastAttack = new Date().getTime() - enemy.lastAttackTime;
                    if (timeSinceLastAttack > 1500) {
                        enemy.attack();
                    }
                } else {
                    this.character.hit();
                    this.healthStatusBar.setPercentage(this.character.energy);
                }
            }
        });
    }
}

//---

/**
 * Checks for collisions between the character and collectible coins.
 */
checkCoinCollisions() {
    if (!this.characterIsDead) {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinStatusBar.setPercentage(this.collectedCoins, this.totalCoins);
            }
        });
    }
}

//---

/**
 * Checks for collisions between the character and collectible bottles.
 */
checkBottleCollisions() {
    if (!this.characterIsDead) {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.collectedBottles++;
                this.bottleStatusBar.setPercentage(this.collectedBottles, this.totalBottles);
            }
        });
    }
}

//---

/**
 * Checks if a bottle should be thrown based on keyboard input and collected bottles.
 */
checkThrowAction() {
    if (this.keyboard.SPACE && this.collectedBottles > 0) {
        let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.collectedBottles--;
        this.bottleStatusBar.setPercentage(this.collectedBottles, this.totalBottles);
        this.keyboard.SPACE = false;
    }
}

//---

/**
 * Checks for collisions between thrown bottles and enemies.
 */
checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !bottle.hasHit) {
                enemy.hit();
                bottle.hasHit = true;
                if (enemy instanceof Endboss) {
                    this.endbossHealthStatusBar.setPercentage(enemy.energy);
                }
            }
        });
    });
}

//---

/**
 * Checks the state of the Endboss to determine if the game is won.
 */
checkEndbossState() {
    let endboss = this.level.enemies.find(e => e instanceof Endboss);
    if (endboss && endboss.isDead() && endboss.isDeadAnimationComplete && !this.gameIsWon) {
        this.triggerGameWon();
    }
}

    /**
     * Triggers the "Game Won" state, stopping the game and starting the win animation.
     */
    triggerGameWon() {
        this.gameIsWon = true;
        this.gameIsRunning = false;
        this.youWin.isGameWon = true;
        this.youWin.startAnimation();
        this.game_music.pause();
        

        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) {
            endboss.stopAnimations = true;
            endboss.loadImage(endboss.Images_DEAD[endboss.Images_DEAD.length - 1]);
        }

        let showWinButtonInterval = setInterval(() => {
            if (this.youWin.isAnimationComplete) {
                document.getElementById('end-screen').classList.remove('hidden');
                document.getElementById('end-screen').classList.add('visible');
                clearInterval(showWinButtonInterval);
            }
        }, 200);

        allIntervals.push(showWinButtonInterval);
    }

    /**
     * Triggers the "Game Over" state, stopping the game and starting the game over animation.
     */
    triggerGameOver() {
        this.gameIsRunning = false;
        this.characterIsDead = true;
        this.gameOver.isGameOver = true;
        this.gameOver.startAnimation();
        this.game_music.pause();
        this.game_over_sound.play();

        let showGameOverButtonInterval = setInterval(() => {
            if (this.gameOver.isAnimationComplete) {
                document.getElementById('end-screen').classList.remove('hidden');
                document.getElementById('end-screen').classList.add('visible');
                clearInterval(showGameOverButtonInterval);
            }
        }, 200);

        allIntervals.push(showGameOverButtonInterval);
    }

    /**
     * The main game loop function. It clears the canvas, draws all objects,
     * and requests the next animation frame to create the game loop.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.spotCharacter && !endboss.isDead()) {
            this.endbossHealthStatusBar.setPercentage(endboss.energy);
            this.addToMap(this.endbossHealthStatusBar);
        }

        if (this.gameOver.isGameOver) {
            this.gameOver.draw(this.ctx);
            this.gameOver.animate();
        }

        if (this.youWin.isGameWon) {
            this.youWin.draw(this.ctx);
            this.youWin.animate();
        }

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Iterates over an array of objects and draws each one onto the canvas.
     * @param {Array<DrawableObject>} objects - An array of objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Adds a single object to the map. It handles image flipping for directional changes.
     * @param {MovableObject} mo - The movable object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally for drawing in the opposite direction.
     * @param {MovableObject} mo - The object whose image should be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas state to draw the image correctly after flipping.
     * @param {MovableObject} mo - The object whose image was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Toggles the sound on and off and changes the mute icon accordingly.
     */
    toggleMute() {
        let muteIcon = document.getElementById('mute-icon');

        if (this.isMuted) {
            // Unmute the sound
            muteIcon.src = 'img/mute.png'; // Passe den Pfad an
            this.game_music.play();
            this.isMuted = false;
        } else {
            // Mute the sound
            muteIcon.src = 'img/unmute.png'; // Passe den Pfad an
            this.game_music.pause();
            this.isMuted = true;
        }
    }
}