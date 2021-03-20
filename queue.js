class Queue {
  #list = [];
  #capacity = null;
  #tail = -1;

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
    return this.#capacity !== null && this.#tail === this.#capacity;
  }

  enqueue(item) {
    if(this.isEmpty) {
      this.#tail = 0;
    }
    
    if (!this.isFull) {
      this.#list.push(item);
      this.#tail += 1;
    }

    return this.size;
  }

  dequeue() {
    return this.#list.shift();
  }

  peek() {
    return this.#list[0];
  }

  toString() {
    return this.#list.toString();
  }
}
