/**
 * Class representing the Game Over screen.
 * Extends DrawableObject to display a full-screen overlay and animate it.
 */
class GameOver extends DrawableObject {
    /** @type {boolean} Flag indicating if the animation is currently running */
    isAnimating = false;

    /** @type {number} Target Y-position for the animation */
    targetY = 0;

    /** @type {number} Speed of the animation movement */
    speed = 5;

    /** @type {boolean} Flag indicating if the game is over */
    isGameOver = false;

    /** @type {boolean} Flag indicating if the animation is complete */
    isAnimationComplete = false;

    /**
     * Creates a GameOver screen instance.
     * Loads the image and sets initial size and position.
     */
    constructor() {
        super();
        this.loadImage('img/You won, you lost/You lost.png');
        this.width = 720;
        this.height = 480;
        this.x = 0;
        this.y = -480;
    }

    /**
     * Starts the animation of the Game Over screen.
     */
    startAnimation() {
        this.isAnimating = true;
    }

    /**
     * Animates the Game Over screen sliding down until it reaches the target position.
     */
    animate() {
        if (this.isAnimating) {
            if (this.y < this.targetY) {
                this.y += this.speed;
            } else {
                this.isAnimating = false;
                this.isGameOver = true;
                this.y = this.targetY;
                this.isAnimationComplete = true;
            }
        }
    }

    /**
     * Draws the semi-transparent overlay and the Game Over image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        super.draw(ctx);
    }
}
