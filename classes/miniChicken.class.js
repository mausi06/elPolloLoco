/**
 * Class representing a MiniChicken enemy.
 * Extends MovableObjetcs and handles walking, death animation, and removal from the world.
 */
class MiniChicken extends MovableObjetcs {
    /** @type {number} Vertical position of the MiniChicken */
    y = 350;

    /** @type {number} Width of the MiniChicken */
    width = 50;

    /** @type {number} Height of the MiniChicken */
    height = 70;

    /** @type {string[]} Images for walking animation */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /** @type {string[]} Images for death animation */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    /**
     * Creates a MiniChicken instance.
     * Loads images, sets initial position, speed, and starts animation.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        this.x = 700 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.energy = 1;
        
        this.animate();
    }

    /**
     * Animates the MiniChicken: moves left and plays walking or death animations.
     */
    animate() {
        setInterval(() => {
            if (world && world.gameIsRunning && !this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => this.removeSelfFromWorld(), 2000);
            } else if (world && world.gameIsRunning) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Handles being hit: sets energy to 0.
     */
    hit() {
        this.energy = 0;
    }

    /**
     * Removes the MiniChicken from the level's enemies array.
     */
    removeSelfFromWorld() {
        if (world && world.level) {
            world.level.enemies = world.level.enemies.filter(enemy => enemy !== this);
        }
    }
}
