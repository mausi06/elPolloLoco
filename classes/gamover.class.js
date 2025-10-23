/**
 * Represents the "Game Over" screen displayed when the player loses the game.
 * Handles loading the image, animating it sliding down from above,
 * and rendering a darkened overlay behind it.
 * 
 * @extends DrawableObject
 */
class GameOver extends DrawableObject {
    /** @type {boolean} Indicates whether the game over animation is currently running. */
    isAnimating = false;

    /** @type {number} The target Y-coordinate where the image stops sliding. */
    targetY = 0;

    /** @type {number} The vertical movement speed of the animation. */
    speed = 5;

    /** @type {boolean} Indicates whether the animation has finished playing. */
    isAnimationComplete = false;

    /**
     * Creates a new "Game Over" screen instance.
     * Loads the image, sets dimensions, and initializes the starting position above the canvas.
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
     * Starts the "Game Over" animation.
     * Resets the completion flag to allow replays of the animation.
     */
    startAnimation() {
        this.isAnimating = true;
        this.isAnimationComplete = false;
    }

    /**
     * Animates the "Game Over" image moving downward into view.
     * When the image reaches its target position, the animation stops.
     */
    animate() {
        if (this.isAnimating) {
            if (this.y < this.targetY) {
                this.y += this.speed;
                if (this.y > this.targetY) this.y = this.targetY;
            } else {
                this.isAnimating = false;
                this.isAnimationComplete = true;
            }
        }
    }

    /**
     * Draws a semi-transparent black overlay and the "Game Over" image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        super.draw(ctx);
    }
}
