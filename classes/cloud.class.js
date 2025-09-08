/**
 * Class representing a cloud in the background.
 * Extends MovableObjetcs to allow movement.
 */
class Cloud extends MovableObjetcs {
    /** @type {number} Vertical position of the cloud */
    y = 20;

    /** @type {number} Width of the cloud image */
    width = 500;

    /** @type {number} Height of the cloud image */
    height = 250;

    /** @type {number} Horizontal position of the cloud */
    x;

    /**
     * Creates a Cloud instance.
     * Loads the cloud image, sets a random horizontal position, and starts movement animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = 200 + Math.random() * 500;
        this.animation();
    }

    /**
     * Animates the cloud by moving it continuously to the left.
     * Runs at ~60 frames per second.
     */
    animation() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
