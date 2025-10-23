/**
 * Represents the "You Win" screen displayed when the player wins the game.
 * Handles loading the win image, running the slide-down animation,
 * and drawing a semi-transparent background overlay.
 * 
 * @extends DrawableObject
 */
class YouWin extends DrawableObject {
    isAnimating = false;
    targetY = 0;
    speed = 5;
    isAnimationComplete = false;

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