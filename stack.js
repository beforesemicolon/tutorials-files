class Stack {
  #list = [];
  #capacity = null;

  constructor(capacity = null) {
    this.#capacity = Math.max(Number(capacity), 0) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return this.#capacity ? this.size === this.#capacity : false;
  }

  push(item) {
    if (!this.isFull) {
      this.#list.push(item);
    }
    
    return this.size;
  }
 
  pop() {
    return this.#list.pop();
  }

  peek() {
    return this.#list[this.size - 1];
  }

  toString() {
    return this.#list.toString();
  }
}
