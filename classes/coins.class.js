/**
 * Class representing a collectible coin in the game.
 * Extends MovableObjetcs for potential movement or collision logic.
 */
class Coins extends MovableObjetcs {
    y = 200;
    width = 100;
    height = 100;
    Images_Walking = [
        'img/8_coin/coin_2.png',
    ];
    
    x;

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
