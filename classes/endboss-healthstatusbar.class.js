/**
 * Class representing the Endboss health status bar.
 * Extends DrawableObject to display different images based on Endboss health percentage.
 */
class EndbossHealthStatusBar extends DrawableObject {
    /** @type {string[]} Array of image paths representing different health stages */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    /** @type {number} Current health percentage of the Endboss */
    percentage = 100;

    /**
     * Creates an EndbossHealthStatusBar instance.
     * Loads all images and sets fixed position and size on the screen.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500; // Fixed position on screen
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the health percentage and updates the displayed image accordingly.
     * @param {number} percentage - Health percentage of the Endboss (0-100)
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
