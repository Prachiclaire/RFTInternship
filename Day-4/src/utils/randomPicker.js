/**
 * RandomPicker
 * Picks items from a list without repeating the same item
 * consecutively. Once all items have been served, the pool resets.
 */
class RandomPicker {
  constructor(items) {
    this.original = [...items];
    this.pool = [...items];
    this.last = null;
  }

  pick() {
    // If only one item and it was the last, return it anyway
    if (this.pool.length === 0) {
      this.pool = [...this.original];
    }

    // Filter out the last picked item to avoid repetition
    let available = this.pool.filter((item) => item !== this.last);

    // If filtering left nothing (e.g. only one unique item), allow repeat
    if (available.length === 0) {
      available = [...this.pool];
    }

    const index = Math.floor(Math.random() * available.length);
    const selected = available[index];

    // Remove from pool
    this.pool.splice(this.pool.indexOf(selected), 1);
    this.last = selected;

    return selected;
  }
}

module.exports = RandomPicker;