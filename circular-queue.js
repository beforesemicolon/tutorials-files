class CircularQueue {
  #list;
  #capacity;
  #tail = -1;
  #head = -1;
  #size = 0;

  constructor(capacity = 10) {
    this.#capacity = Math.max(Number(capacity), 0) || 10;
    this.#list = Array.from({length: this.#capacity});
  }

  get size() {
    return this.#size;
  }

  get isFull() {
    return this.size === this.#capacity;
  }

  get isEmpty() {
    return this.size === 0;
  }

  enqueue(item) {
    if (!this.isFull) {
      this.#tail = (this.#tail + 1) % this.#capacity;
      this.#list[this.#tail] = item;
      this.#size += 1;

      if (this.#head === -1) {
        this.#head = this.#tail;
      }
    }

    return this.size;
  }

  dequeue() {
    let item = null;
    if (!this.isEmpty) {
      item = this.#list[this.#head];
      delete this.#list[this.#head];
      this.#head = (this.#head + 1) % this.#capacity;
      this.#size -= 1;

      if (!this.size) {
        this.#head = -1;
        this.#tail = -1;
      }
    }
    return item;
  }

  peek() {
    return this.#list[this.#head];
  }

  toString() {
    return this.#list.filter((el) => el !== undefined).toString();
  }
}
