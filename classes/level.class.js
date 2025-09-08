/**
 * Class representing a game level.
 * Contains all objects in the level including enemies, clouds, background objects, coins, and bottles.
 */
class Level {
    /** @type {Array} Array of enemies in the level */
    enemies;

    /** @type {Array} Array of cloud objects in the level */
    clouds;

    /** @type {Array} Array of background objects in the level */
    backgroundObjects;

    /** @type {Array} Array of coin objects in the level */
    coins;

    /** @type {Array} Array of bottle objects in the level */
    bottles;

    /** @type {number} X-coordinate where the level ends */
    level_end_x = 2200;

    /**
     * Creates a Level instance.
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottles - Array of bottle objects
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
