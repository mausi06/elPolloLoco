/**
 * Class representing the "You Win" screen.
 * Extends DrawableObject and handles animation for displaying the win screen.
 */
class YouWin extends DrawableObject {
    /** @type {boolean} Flag indicating if the animation is currently running */
    isAnimating = false;

    /** @type {number} Target Y-coordinate for the animation */
    targetY = 0;

    /** @type {number} Speed at which the win screen moves down */
    speed = 5;

    /** @type {boolean} Flag indicating if the game has been won */
    isGameWon = false;

    /** @type {boolean} Flag indicating if the animation has completed */
    isAnimationComplete = false;

    /**
     * Creates a YouWin screen instance.
     * Loads the win image and sets initial position and size.
     */
    constructor() {
        super();
        this.loadImage('img/You won, you lost/You Win A.png');
        this.width = 720;
        this.height = 480;
        this.x = 0;
        this.y = -480;
    }

    /** Starts the win screen animation */
    startAnimation() {
        this.isAnimating = true;
    }

    /**
     * Animates the win screen moving down to target position.
     */
    animate() {
        if (this.isAnimating) {
            if (this.y < this.targetY) {
                this.y += this.speed;
            } else {
                this.isAnimating = false;
                this.isGameWon = true;
                this.y = this.targetY;
                this.isAnimationComplete = true;
            }
        }
    }

    /**
     * Draws a semi-transparent overlay and the win screen image.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        super.draw(ctx);
    }
}
