class Queue {
  #list = [];
  #capacity = null;

  constructor(capacity) {
    this.#capacity = Number(capacity) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return Boolean(this.#capacity) && this.size === this.#capacity;
  }

  enqueue(item) {
    if (!this.#capacity || this.size < this.#capacity) {
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
