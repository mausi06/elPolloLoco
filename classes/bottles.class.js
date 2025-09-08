/**
 * Class representing a collectible bottle in the game.
 * Extends MovableObjetcs for potential movement functionality.
 */
class Bottle extends MovableObjetcs {
  /**
   * Vertical position of the bottle.
   * @type {number}
   */
  y = 380;

  /**
   * Width of the bottle image.
   * @type {number}
   */
  width = 50;

  /**
   * Height of the bottle image.
   * @type {number}
   */
  height = 50;

  /**
   * Array of image paths for the bottle.
   * Currently only one image for the bottle on the ground.
   * @type {string[]}
   */
  Images_BOTTLE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
  ];

  /**
   * Creates a new Bottle instance.
   * Loads the bottle image and sets a random horizontal position.
   */
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
