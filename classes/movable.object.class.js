/**
 * Class representing a movable object in the game.
 * Extends DrawableObject and adds physics, movement, collision, and animation handling.
 */
class MovableObjetcs extends DrawableObject {
    /** @type {number} Horizontal movement speed */
    speed = 0.2;

    /** @type {boolean} Flag indicating if the object is facing the other direction */
    otherDirection = false;

    /** @type {number} Vertical speed (for jumping/falling) */
    speedY = 0;

    /** @type {number} Gravity acceleration applied to vertical movement */
    acceleration = 2;

    /** @type {number} Current energy/health of the object */
    energy = 100;

    /** @type {number} Timestamp of the last hit taken */
    lastHit = 0;

    /**
     * Applies gravity to the object, updating its vertical position over time.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                if (world && world.gameIsRunning) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                }
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if object is above the ground, false otherwise
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks if this object is colliding with another object.
     * @param {MovableObjetcs} mo - Another movable object to check collision with
     * @returns {boolean} True if colliding, false otherwise
     */
    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height
        );
    }

    /**
     * Reduces energy by 5 and sets lastHit timestamp.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is currently hurt (within 1.5 seconds of last hit).
     * @returns {boolean} True if hurt, false otherwise
     */
    isHurt() {
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 1.5;
    }

    /**
     * Checks if the object is dead (energy is 0).
     * @returns {boolean} True if dead, false otherwise
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks if the game is currently active.
     * @returns {boolean} True if game is running
     */
    isGameActive() {
        return world && world.gameIsRunning;
    }

    /** Moves the object to the right by its speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object to the left by its speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Plays an animation by cycling through an array of images.
     * @param {string[]} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Makes the object jump by setting vertical speed. */
    jump() {
        this.speedY = 30;
    }
}
