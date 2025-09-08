/**
 * Class representing the player's health status bar.
 * Extends DrawableObject and updates its image based on current health percentage.
 */
class HealthStatusBar extends DrawableObject {
    /** @type {string[]} Array of image paths for different health levels */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ];

    /** @type {number} Current health percentage (0-100) */
    percentage = 100;

    /**
     * Creates a HealthStatusBar instance.
     * Loads all images and sets position and size on the screen.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the health percentage and displays the corresponding image.
     * @param {number} percentage - Current health percentage (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the index of the image to display based on the current health percentage.
     * @returns {number} Index of the image in the IMAGES array.
     */
    resolveIndex() {
        if (this.percentage == 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}
