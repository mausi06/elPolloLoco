/**
 * Represents a static background object in the game world.
 * Inherits movement capabilities from MovableObjects but remains visually fixed.
 * 
 * @extends MovableObjetcs
 */

class BackgroundObject extends MovableObjetcs{

  width = 720;
  height = 480;
  constructor(imagePath, x){
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; 
  }
}