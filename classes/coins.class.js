/**
 * Class representing a collectible coin in the game.
 * Extends MovableObjetcs for potential movement or collision logic.
 */
class Coins extends MovableObjetcs {
    /** @type {number} Vertical position of the coin */
    y = 300;

    /** @type {number} Width of the coin image */
    width = 100;

    /** @type {number} Height of the coin image */
    height = 100;

    /** @type {string[]} Image paths for coin animation */
    Images_Walking = [
        'img/8_coin/coin_2.png',
    ];

    /** @type {number} Horizontal position of the coin */
    x;

    /**
     * Creates a Coins instance.
     * Loads the coin image, sets a random horizontal position, and starts animation loop.
     */
    constructor() {
        super().loadImage(this.Images_Walking[0]);
        this.loadImages(this.Images_Walking);

        this.x = 300 + Math.random() * 1800;
        this.animate();
    }

    /**
     * Animates the coin by cycling through its images.
     * Runs every 200 milliseconds.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.Images_Walking);
        }, 200);
    }
}
