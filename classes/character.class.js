/**
 * Class representing the main character of the game.
 * Extends MovableObjetcs to inherit movement, gravity, and collision logic.
 */
class Character extends MovableObjetcs {
    /** @type {number} Vertical position of the character */
    y = 80;

    /** @type {number} Height of the character */
    height = 250;

    /** @type {number} Movement speed of the character */
    speed = 10;

    /** @type {number} Energy (health) of the character */
    energy = 100;

    /** @type {boolean} Flag to stop all animations */
    stopAnimations = false;

    /** @type {boolean} Flag indicating if the death animation has finished */
    isDeadAnimationComplete = false;

    /** @type {boolean} Internal flag to prevent hurt sound from repeating */
    hurt_sound_played = false;

    /** @type {string[]} Image paths for walking animation */
    Images_Walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Image paths for jumping animation */
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

    /** @type {string[]} Image paths for death animation */
    Images_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /** @type {string[]} Image paths for hurt animation */
    Images_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {HTMLAudioElement} Walking sound effect */
    walking_sound = new Audio('audio/walking-sound-effect-272246.mp3');

    /** @type {HTMLAudioElement} Jump sound effect */
    jump_sound = new Audio('audio/jump.mp3');

    /** @type {HTMLAudioElement} Hurt sound effect */
    hurt_sound = new Audio('audio/hurt.mp3');

    /**
     * Creates a Character instance.
     * Loads all animations, applies gravity, loops walking sound, and starts animations.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.Images_Walking);
        this.loadImages(this.Images_JUMPING);
        this.loadImages(this.Images_DEAD);
        this.loadImages(this.Images_HURT);
        this.applyGravity();
        this.walking_sound.loop = true;
        this.animate();
    }

    /**
     * Starts the animation loops for movement/sound and sprite animations.
     */
    animate() {
        setInterval(() => this.handleMovementAndSound(), 1000 / 60);
        setInterval(() => this.handleAnimations(), 50);
    }

    /**
     * Handles character movement based on keyboard input and plays walking/jump sounds.
     */
    handleMovementAndSound() {
        if (this.stopAnimations || !this.world?.gameIsRunning) {
            this.stopAllSounds();
            return;
        }

        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        if (isMoving && !this.isAboveGround()) {
            this.walking_sound.play().catch(() => {});
        } else {
            this.walking_sound.pause();
        }

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
        }

        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles sprite animations and plays corresponding sounds (walking, jumping, hurt, dead).
     */
    handleAnimations() {
        if (this.stopAnimations) return;

        if (this.isDead() && !this.isDeadAnimationComplete) {
            this.playAnimation(this.Images_DEAD);
            setTimeout(() => {
                this.isDeadAnimationComplete = true;
                this.loadImage(this.Images_DEAD[this.Images_DEAD.length - 1]);
                this.stopAnimations = true;
                this.stopAllSounds();
            }, this.Images_DEAD.length * 200);
        } else if (this.isHurt()) {
            this.playAnimation(this.Images_HURT);
            if (!this.hurt_sound_played) {
                this.hurt_sound.play().catch(() => {});
                this.hurt_sound_played = true;
            }
        } else {
            this.hurt_sound_played = false;
            if (this.isAboveGround()) {
                this.playAnimation(this.Images_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.Images_Walking);
            }
        }
    }

    /**
     * Checks if the character is dead.
     * @returns {boolean} True if energy is 0, else false
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Stops all currently playing character sounds.
     */
    stopAllSounds() {
        this.walking_sound.pause();
        this.jump_sound.pause();
        this.hurt_sound.pause();
    }

    /**
     * Plays jump sound and calls the jump function from MovableObjetcs.
     */
    jump() {
        super.jump();
        this.jump_sound.play();
    }

    /**
     * Plays hurt sound and calls the hit function from MovableObjetcs.
     */
    hit() {
        super.hit();
        this.hurt_sound.play();
    }
}
