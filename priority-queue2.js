class PriorityQueue {
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
  
  #createItem(value, priority) {
    return {
      next: null,
      value,
      priority
    }
  }
  
  enqueue(item, priority = 0) {
    priority = Math.max(Number(priority), 0);
    
    if(!this.isFull) {
      const newItem = this.#createItem(item, priority);
      
      if(this.isEmpty) {
        this.#firstItem = newItem;
        this.#lastItem = newItem;
      } else if(newItem.priority <= this.#lastItem.priority) {
        this.#lastItem.next = newItem;
        this.#lastItem = newItem;
      } else if(newItem.priority > this.#firstItem.priority) {
        newItem.next = this.#firstItem;
        this.#firstItem = newItem;
      } else {
        let current = this.#firstItem;
        
        while(current) {
          if(newItem.priority > current.next.priority) {
            newItem.next = current.next;
            current.next = newItem;
            break;
          }
          current = current.next;
        }
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
    if(this.isEmpty) {
      return null;
    }
    
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
