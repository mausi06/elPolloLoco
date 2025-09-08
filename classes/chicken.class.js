/**
 * Class representing a chicken enemy in the game.
 * Extends MovableObjetcs for movement and collision logic.
 */
class Chicken extends MovableObjetcs {
    /** @type {number} Vertical position of the chicken */
    y = 330;

    /** @type {number} Width of the chicken */
    width = 70;

    /** @type {number} Height of the chicken */
    height = 100;

    /** @type {string[]} Image paths for walking animation */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /** @type {string[]} Image paths for death animation */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /** @type {number} Movement speed of the chicken */
    speed;

    /** @type {number} Health points of the chicken */
    energy;

    /**
     * Creates a Chicken instance.
     * Loads all animations, sets random horizontal position and speed, and starts animation loops.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 1400 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.energy = 1; // The chicken has only 1 health point

        this.animate();
    }

    /**
     * Starts the movement and animation loops.
     * Moves the chicken left continuously if alive, and plays walking or death animations.
     */
    animate() {
        // Interval for movement
        setInterval(() => {
            if (world && world.gameIsRunning && !this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        // Interval for animations
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                // Remove the chicken from the world after the death animation
                setTimeout(() => {
                    this.removeSelfFromWorld();
                }, 2000);
            } else if (world && world.gameIsRunning) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Handles when the chicken is hit by the player.
     * Sets energy to 0, triggering death animation in the animate() loop.
     */
    hit() {
        this.energy = 0;
    }

    /**
     * Removes the chicken from the game world.
     * Filters it out of the world's enemies array.
     */
    removeSelfFromWorld() {
        if (world && world.level) {
            world.level.enemies = world.level.enemies.filter(enemy => enemy !== this);
        }
    }
}
