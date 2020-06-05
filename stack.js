class Stack {
  #list = [];
  #maxSize;

  constructor(maxSize) {
    this.#maxSize = Number(maxSize) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return this.#maxSize !== null && this.size === this.#maxSize;
  }

  push(item) {
    if (this.#maxSize === null || this.size < this.#maxSize) {
      this.#list.push(item);
    }

    return this.size;
  }

  pop() {
    return this.pop();
  }

  peek() {
    return this.#list[this.size - 1];
  }

  print() {
    console.log(this.#list);
  }
}
