/**
 * Represents the "You Win" screen displayed when the player wins the game.
 * Handles loading the win image, running the slide-down animation,
 * and drawing a semi-transparent background overlay.
 * 
 * @extends DrawableObject
 */
class YouWin extends DrawableObject {
    /** @type {boolean} Indicates whether the win screen animation is running. */
    isAnimating = false;

    /** @type {number} The final Y position where the animation should stop. */
    targetY = 0;

    /** @type {number} The vertical speed at which the win image moves down. */
    speed = 5;

    /** @type {boolean} Indicates whether the animation has fully completed. */
    isAnimationComplete = false;

    /**
     * Creates a new instance of the "You Win" screen.
     * Loads the image, sets size and initial position (off-screen above the canvas).
     */
    constructor() {
        super();
        this.loadImage('img/You won, you lost/You Win A.png');
        this.width = 720;
        this.height = 480;
        this.x = 0;
        this.y = -480;
    }

    /**
     * Starts the animation for sliding the win screen into view.
     * Resets any previous completion state.
     */
    startAnimation() {
        this.isAnimating = true;
        this.isAnimationComplete = false;
    }

    /**
     * Animates the movement of the win screen downward until it reaches the target position.
     * Once the target Y position is reached, the animation stops and is marked complete.
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
     * Draws a semi-transparent black overlay and the win screen image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        super.draw(ctx);
    }
}