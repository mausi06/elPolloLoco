/**
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing, and caching.
 */
class DrawableObject {
    /** @type {HTMLImageElement} Current image to display */
    img;

    /** @type {Object.<string, HTMLImageElement>} Cache for preloaded images */
    imageCache = {};

    /** @type {number} Index of the current image in animations */
    currentImage = 0;

    /** @type {number} Horizontal position */
    x = 120;

    /** @type {number} Vertical position */
    y = 280;

    /** @type {number} Width of the drawable object */
    width = 100;

    /** @type {number} Height of the drawable object */
    height = 150;

    /**
     * Loads an image from a given path.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on a given canvas context.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        if (this.isGameOverScreen) {
            ctx.drawImage(this.img, 0, 0, 720, 480);
        } else {
            try {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            } catch (e) {
                console.warn('Error loading image!', e);
                console.log('Could not load image', this.img.src);
            }
        }
    }

    /**
     * Draws a blue border around certain objects for debugging/collision visualization.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawBorder(ctx) {
        if (this instanceof Character || this instanceof MiniChicken || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Preloads an array of image paths into the image cache.
     * @param {string[]} arr - Array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
