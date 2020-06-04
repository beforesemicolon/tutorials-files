class Queue {
  #list = [];
  #capacity = null;

  constructor(capacity) {
    this.#capacity = Math.max(Number(capacity), 0) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return this.#capacity !== null && this.size === this.#capacity;
  }

  enqueue(item) {
    if (this.#capacity === null || this.size < this.#capacity) {
      return this.#list.push(item);
    }

    return this.size;
  }

  dequeue() {
    return this.#list.shift();
  }

  peek() {
    return this.#list[0];
  }

  print() {
    console.log(this.#list);
  }
}
