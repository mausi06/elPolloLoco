/**
 * Class representing the main controllable character of the game.
 * Extends {@link MovableObjetcs} to inherit physics, gravity, and collision logic.
 * Handles player input, animation, and sound effects.
 */
class Character extends MovableObjetcs {
    y = 80;
    height = 250;
    speed = 10;
    energy = 100;

    stopAnimations = false;
    isDeadAnimationComplete = false;
    hurt_sound_played = false;
    jumpAnimationPlayed = false;

    /**
     * Image sets for different animation states.
     * Each state contains an ordered list of image frame paths.
     */
    Images_IDILE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    Images_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    Images_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    Images_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    Images_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    Images_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {HTMLAudioElement} Sound effect when walking. */
    walking_sound = new Audio('audio/walking-sound-effect-272246.mp3');

    /** @type {HTMLAudioElement} Sound effect when jumping. */
    jump_sound = new Audio('audio/jump.mp3');

    /** @type {HTMLAudioElement} Sound effect when taking damage. */
    hurt_sound = new Audio('audio/hurt.mp3');

    /** @type {string[]} Current active animation frame set. */
    currentAnimation = null;

    /** @type {number} Index of the current animation frame. */
    currentFrameIndex = 0;

    /** @type {number} Frame timing and playback control. */
    frameTimer = 0;
    frameDelay = 50;
    animationLoop = true;

    /** @type {number} Timestamp of the last player action, used for idle → sleep transition. */
    lastActionTime = Date.now();

    /** @type {boolean} Indicates if the character is currently sleeping. */
    isSleeping = false;

    /**
     * Creates the main character, loads all animations, and initializes movement logic.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.Images_IDILE);
        this.loadImages(this.Images_SLEEPING);
        this.loadImages(this.Images_WALKING);
        this.loadImages(this.Images_JUMPING);
        this.loadImages(this.Images_DEAD);
        this.loadImages(this.Images_HURT);

        this.currentAnimation = this.Images_IDILE;
        this.currentFrameIndex = 0;
        this.frameDelay = 150;
        this.animationLoop = true;
        this.loadImage(this.currentAnimation[this.currentFrameIndex]);

        this.applyGravity();
        this.walking_sound.loop = true;
        this.animate();
    }

    /**
     * Starts the main animation and movement loops.
     */
    animate() {
        setInterval(() => this.handleMovementAndSound(), 1000 / 60);
        setInterval(() => {
            if (this.stopAnimations) return;

            if (this.handleDeathAnimation()) return;
            if (this.handleHurtAnimation()) return;
            if (this.handleSleepAnimation()) return;
            if (this.handleJumpAnimation()) return;
            if (this.handleWalkAnimation()) return;
            this.handleIdleAnimation();
        }, 50);
    }

    /**
     * Handles player input, sound playback, and camera positioning.
     * Delegates logic to smaller helper functions for clarity.
     */
    handleMovementAndSound() {
        if (this.stopAnimations || !this.world?.gameIsRunning) return this.stopAllSounds();

        this.updateActivityState();
        this.handleWalkingSound();
        this.handleMovementInput();
        this.updateCameraPosition();
    }

    /** Updates the sleep timer and resets sleep state when moving. */
    updateActivityState() {
        const moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP;
        if (moving) {
            this.lastActionTime = Date.now();
            this.isSleeping = false;
        }
    }

    /** Starts or pauses walking sound depending on movement state. */
    handleWalkingSound() {
        const walking = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround();
        walking ? this.walking_sound.play().catch(() => {}) : this.walking_sound.pause();
    }

    /** Handles directional movement and jumping logic. */
    handleMovementInput() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(); this.otherDirection = true;
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) this.jump();
    }

    /** Updates the camera position based on the character's x-coordinate. */
    updateCameraPosition() {
        this.world.camera_x = -this.x + 100;
    }

    /** Handles death animation and stops all sounds once complete. */
    handleDeathAnimation() {
        if (!this.isDead()) return false;
        this.switchAnimation(this.Images_DEAD, 200, false);
        this.advanceAnimation(50);
        if (this.currentFrameIndex === this.Images_DEAD.length - 1) {
            this.isDeadAnimationComplete = true;
            this.stopAnimations = true;
            this.stopAllSounds();
        }
        return true;
    }

    /** Plays the hurt animation and sound. */
    handleHurtAnimation() {
        if (!this.isHurt()) {
            this.hurt_sound.pause(); this.hurt_sound.currentTime = 0;
            return false;
        }
        this.switchAnimation(this.Images_HURT, 120, true);
        this.advanceAnimation(50);
        if (this.hurt_sound.paused) this.hurt_sound.play().catch(() => {});
        return true;
    }

    /** Handles sleep state after inactivity. */
    handleSleepAnimation() {
        if (!this.isSleeping && Date.now() - this.lastActionTime > 10000) {
            this.isSleeping = true;
            this.switchAnimation(this.Images_SLEEPING, 200, true);
        }
        if (this.isSleeping) {
            this.advanceAnimation(50);
            return true;
        }
        return false;
    }

    /** Handles jump animation logic. */
    handleJumpAnimation() {
        if (!this.isAboveGround()) return false;
        if (!this.jumpAnimationPlayed) {
            this.switchAnimation(this.Images_JUMPING, 150, false);
            this.jumpAnimationPlayed = true;
        }
        this.advanceAnimation(50);
        return true;
    }

    /** Handles walking animation logic. */
    handleWalkAnimation() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) return false;
        this.switchAnimation(this.Images_WALKING, 60, true);
        this.jumpAnimationPlayed = false;
        this.advanceAnimation(50);
        return true;
    }

    /** Handles idle animation when no input or action occurs. */
    handleIdleAnimation() {
        this.switchAnimation(this.Images_IDILE, 150, true);
        this.jumpAnimationPlayed = false;
        this.advanceAnimation(50);
    }

    /**
     * Switches the current animation sequence.
     * @param {string[]} images - Array of image paths representing the animation.
     * @param {number} [frameDelayMs=50] - Delay between animation frames.
     * @param {boolean} [loop=true] - Whether the animation should loop.
     */
    switchAnimation(images, frameDelayMs = 50, loop = true) {
        if (this.currentAnimation !== images) {
            this.currentAnimation = images;
            this.currentFrameIndex = -1;
            this.frameTimer = 0;
            this.frameDelay = frameDelayMs;
            this.animationLoop = !!loop;
        }
    }

    /**
     * Advances the animation frame based on elapsed time.
     * @param {number} deltaMs - Time elapsed since the last frame update.
     */
    advanceAnimation(deltaMs) {
        if (!this.currentAnimation || this.currentAnimation.length === 0) return;

        this.frameTimer += deltaMs;
        if (this.frameTimer < this.frameDelay && this.currentFrameIndex !== -1) return;

        this.frameTimer = 0;

        if (this.currentFrameIndex < this.currentAnimation.length - 1) {
            this.currentFrameIndex++;
        } else {
            this.currentFrameIndex = this.animationLoop ? 0 : this.currentAnimation.length - 1;
        }

        this.loadImage(this.currentAnimation[this.currentFrameIndex]);
    }

    /**
     * Checks if the character's energy is depleted.
     * @returns {boolean} True if the character is dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Pauses all currently active sounds.
     */
    stopAllSounds() {
        this.walking_sound.pause();
        this.jump_sound.pause();
        this.hurt_sound.pause();
    }

    /**
     * Makes the character jump and plays the jump sound.
     */
    jump() {
        super.jump();
        this.jump_sound.play().catch(() => {});
    }

    /**
     * Reduces the character's energy when hit and plays the hurt sound.
     */
    hit() {
        super.hit();
        this.hurt_sound.play().catch(() => {});
    }
}
