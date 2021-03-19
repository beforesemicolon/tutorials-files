class Queue {
  #firstItem = null;
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
      next: null,
      value
    }
  }
  
  enqueue(item) {
    if(!this.isFull) {
      const newItem = this.#createItem(item);
      
      if(this.isEmpty) {
        this.#firstItem = newItem;
        this.#lastItem = newItem;
      } else {
        this.#lastItem.next = newItem;
        this.#lastItem = newItem;
      }
      
      this.#size += 1;
    }
    
    return this.size;
  }
  
  dequeue() {
    let removedItem = null;
    
    if(!this.isEmpty) {
      removedItem = this.#firstItem.value;
      this.#firstItem = this.#firstItem.next;
      this.#size -= 1;
    }
    
    return removedItem;
  }
  
  peek() {
    return this.#firstItem.value;
  }
  
  toString() {
    if(this.isEmpty) {
      return '';
    }
    
    let current = this.#firstItem;
    let str = `${current.value}`;
    
    while(current.next) {
      current = current.next;
      str = `${str},${current.value}`;
    }
    
    return str;
  }
}
