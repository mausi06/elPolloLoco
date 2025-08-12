class GameOver extends DrawableObject {
    // Eigenschaften für die Animation
    isAnimating = false;
    targetY = 0;
    speed = 5; 
    
    // Zustand
    isGameOver = false;

    constructor() {
        super();
        this.loadImage('img/You won, you lost/You lost.png');
        this.width = 720;
        this.height = 480;
        this.x = 0;
        this.y = -480;
    }

    /**
     * Startet die Game-Over-Animation.
     */
    startAnimation() {
        this.isAnimating = true;
    }
    
    /**
     * Führt die Animation durch, bis das Ziel erreicht ist.
     * Setzt den finalen Zustand, sobald die Animation beendet ist.
     */
    animate() {
        if (this.isAnimating) {
            if (this.y < this.targetY) {
                this.y += this.speed;
            } else {
                this.isAnimating = false; // Animation stoppen
                this.isGameOver = true;   // Game Over Zustand setzen
                this.y = this.targetY;    // Position fixieren
            }
        }
    }
    
    /**
     * Zeichnet den dunklen Overlay und den Game-Over-Screen auf dem Canvas.
     * @param {CanvasRenderingContext2D} ctx - Der 2D-Rendering-Kontext des Canvas.
     */
    draw(ctx) {
        // Dunklen Overlay zeichnen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Game-Over-Screen zeichnen (aus der DrawableObject-Klasse)
        super.draw(ctx);
    }
}