class CircularQueue {
  #list;
  #capacity;
  #tail = 0;
  #head = 0;
  #size = 0;

  constructor(capacity) {
    this.#capacity = Math.max(Number(capacity), 0) || 10;
    this.#list = Array(this.#capacity).fill(null);
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
      this.#list[this.#tail] = item;
      this.#tail = (this.#tail + 1) % this.#capacity;
      this.#size += 1;
    }

    return this.size;
  }

  dequeue() {
    let item = null;
    if (!this.isEmpty) {
      item = this.#list[this.#head];
      this.#list[this.#head] = null;
      this.#head = (this.#head + 1) % this.#capacity;
      this.#size -= 1;
    }

    return item;
  }

  peek() {
    return this.#list[this.#head];
  }

  print() {
    console.log(this.#list.filter((el) => el !== null));
  }
}
