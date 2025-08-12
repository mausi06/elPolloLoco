class MovableObjetcs extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;

  lastHit = 0;

  applyGravity() {
    // NEU: Prüfen, ob das Spiel läuft, um die Schleife zu stoppen, wenn das Spiel vorbei ist
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        if (world && world.gameIsRunning) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) { // NEU: Prüfung für die geworfene Flasche
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(mo) {
    // Hier ist deine Kollisionslogik
    return this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x && this.y < mo.y + mo.height;
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1.5;
  }

  isDead() {
    return this.energy == 0;
  }

  // NEU: Korrigierte isGameActive-Methode
  isGameActive() {
    return world && world.gameIsRunning;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }
}