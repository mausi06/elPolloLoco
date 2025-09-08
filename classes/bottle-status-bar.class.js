/**
 * Class representing a bottle status bar.
 * Extends DrawableObject to display different images based on the current bottle percentage.
 */
class BottleStatusBar extends DrawableObject {
  /**
   * Array of image paths representing the different stages of the bottle status.
   * @type {string[]}
   */
  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
  ];

  /**
   * Current percentage of bottles collected.
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a BottleStatusBar instance.
   * Loads all images and sets default position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 80;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets the current bottle percentage and updates the displayed image.
   * @param {number} currentBottles - Number of bottles collected currently.
   * @param {number} totalBottles - Total number of bottles to collect.
   */
  setPercentage(currentBottles, totalBottles) {
    let percentage = (currentBottles / totalBottles) * 100;
    this.percentage = Math.min(100, percentage);
    let path = this.IMAGES[this.resolveIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} Index of the image in the IMAGES array.
   */
  resolveIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}
