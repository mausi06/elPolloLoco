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

    startAnimation() {
        this.isAnimating = true;
        this.isAnimationComplete = false;
    }

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

    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        super.draw(ctx);
    }
}
