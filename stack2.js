class Stack {
  #lastItem = null;
  #size = 0;
  #capacity = null;
  
  constructor(capacity = null) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return this.#capacity ? this.size === this.#capacity : false;
  }
  
  #createItem(value) {
    return {
      prev: null,
      value
    }
  }
  
  push(item) {
    if(!this.isFull) {
      const newItem = this.#createItem(item);
    
      if(this.#lastItem) {
        newItem.prev = this.#lastItem;
      }

      this.#lastItem = newItem;
      this.#size += 1;
    }
    
    return this.size;
  }
  
  pop() {
    let removedItem = null;
    
    if(!this.isEmpty) {
      removedItem = this.#lastItem.value;
      this.#lastItem = this.#lastItem.prev;
      this.#size -= 1;
    }
    
    return removedItem;
  }
  
  peek() {
    return this.#lastItem.value;
  }
  
  toString() {
    let current = this.#lastItem;
    let str = `${current.value}`;
    
    while(current.prev) {
      current = current.prev;
      str = `${current.value},${str}`;
    }
    
    return str;
  }
}
