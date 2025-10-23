/**
 * Class representing a MiniChicken enemy.
 * Extends MovableObjetcs and handles walking, death animation, and removal from the world.
 */
class MiniChicken extends MovableObjetcs {
    y = 350;
    width = 50;
    height = 70;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /** @type {string[]} Images for death animation */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];
    
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
