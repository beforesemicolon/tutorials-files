class PriorityQueue {
  #list = [];
  #capacity;

  constructor(capacity) {
    this.#capacity = Math.max(Number(capacity), 0) || null;
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

  enqueue(item, priority = 0) {
    priority = Math.max(Number(priority), 0);
    const element = { item, priority };

    if (
      this.isEmpty ||
      element.priority <= this.#list[this.size - 1].priority
    ) {
      this.#list.push(element);
    } else {
      for (let index in this.#list) {
        if (element.priority > this.#list[index].priority) {
          this.#list.splice(index, 0, element);
          break;
        }
      }
    }

    return this.size;
  }

  dequeue() {
    return this.isEmpty ? null : this.#list.shift().item;
  }

  toString() {
    return this.#list.map((el) => el.item).toString();
  }
}
