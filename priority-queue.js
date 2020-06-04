class PriorityQueue {
  #list = [];
  #capacity;

  constructor(capacity) {
    this.#capacity = Number(capacity) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isFull() {
    return this.#capacity !== null && this.size === this.#capacity;
  }

  get isEmpty() {
    return this.size === 0;
  }

  enqueue(item, priority) {
    priority = Math.max(Number(priority), 0);
    const element = { item, priority };

    if (
      this.isEmpty ||
      element.priority >= this.#list[this.size - 1].priority
    ) {
      this.#list.push(element);
    } else {
      for (let index in this.#list) {
        if (element.priority < this.#list[index].priority) {
          this.#list.splice(index, 0, element);
          break;
        }
      }
    }

    return this.size;
  }

  dequeue() {
    const element = this.#list.shift();
    return element ? element.item : null;
  }

  print() {
    console.log(this.#list.map((el) => el.item));
  }
}
