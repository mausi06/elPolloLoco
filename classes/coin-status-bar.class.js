/**
 * Class representing the coin status bar in the game.
 * Extends DrawableObject to display different images based on collected coins.
 */
class CoinStatusBar extends DrawableObject {
    /** @type {string[]} Array of image paths representing different coin collection stages */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /** @type {number} Current percentage of coins collected */
    percentage = 0;

    /**
     * Creates a CoinStatusBar instance.
     * Loads all images and sets default position and size.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 40;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the percentage of coins collected and changes the displayed image.
     * @param {number} currentCoins - Number of coins collected currently.
     * @param {number} totalCoins - Total number of coins to collect.
     */
    setPercentage(currentCoins, totalCoins) {
        let percentage = (currentCoins / totalCoins) * 100;
        this.percentage = Math.min(100, percentage);
        let path = this.IMAGES[this.resolveIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the index of the image to display based on the current coin percentage.
     * @returns {number} Index of the image in the IMAGES array.
     */
    resolveIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}
