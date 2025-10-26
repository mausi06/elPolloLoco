/**
 * Creates and returns the first game level configuration.
 * 
 * This function constructs a new {@link Level} instance with:
 * - Enemies (MiniChickens, Chickens, Endboss)
 * - Clouds for background animation
 * - Multiple background layers to create parallax scrolling effect
 * - Coins and bottles as collectible items
 * 
 * @returns {Level} A fully initialized Level 1 instance.
 */
function createLevel1() {
  return new Level(
    [
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Endboss()
    ],

    [
      new Cloud()
    ],

    [
      new BackgroundObject('img/5_background/layers/air.png', -720),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

      new BackgroundObject('img/5_background/layers/air.png', 720),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

      new BackgroundObject('img/5_background/layers/air.png', 720*2),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),

      new BackgroundObject('img/5_background/layers/air.png', 720*3),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3),
    ],

    [
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins()
    ],

    [
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
    ]
  );
}
