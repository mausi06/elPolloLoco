/**
 * Class representing a chicken enemy in the game.
 * Extends MovableObjetcs for movement and collision logic.
 */
class Chicken extends MovableObjetcs {
    y = 330;
    width = 70;
    height = 100;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    speed;
    energy;
    
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 1400 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.energy = 1;

        this.animate();
    }

    /**
     * Starts the movement and animation loops.
     * Moves the chicken left continuously if alive, and plays walking or death animations.
     */
    animate() {
        setInterval(() => {
            if (world && world.gameIsRunning && !this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                if (!this.deathTriggered) {
                    this.playAnimation(this.IMAGES_DEAD);
                    this.deathTriggered = true;
                }
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
