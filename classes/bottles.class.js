/**
 * Class representing a collectible bottle in the game.
 * Extends MovableObjetcs for potential movement functionality.
 */
class Bottle extends MovableObjetcs {
  y = 380;
  width = 50;
  height = 50;
  Images_BOTTLE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
  ];

  constructor() {
    super().loadImage(this.Images_BOTTLE[0]);
    /**
     * Horizontal position of the bottle.
     * Randomized between 200 and 2000.
     * @type {number}
     */
    this.x = 200 + Math.random() * 1800;
  }
}
