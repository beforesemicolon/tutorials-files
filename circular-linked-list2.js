class CircularLinkedList {
  #size = 0;
  head = null;
  
  get size() {
    return this.#size;
  }
  
  createElement(value) {
    return {value, next: null, prev: null}
  }
  
  push(item) {
    const element = this.createElement(item);
    
    if(this.head === null) {
      this.head = element;
      this.tail = element;
    } else {
      this.tail.next = element;
      element.prev = this.tail;
      this.tail = element;
    }
    
    this.tail.next = this.head;
    this.head.prev = this.tail;
    
    this.#size += 1;
    return this.size;
  }
  
  insert(item, index = 0) {
    if (index < 0 || index > this.size) return;

    const element = this.createElement(item);

    if (index === 0) {
      element.next = this.head;
      
      if(this.head) {
        this.head.prev = element;
      } else {
        this.tail = element;
      }
      
      this.head = element;
    } else if(index === this.size) {
      this.tail.next = element;
      element.prev = this.tail;
      this.tail = element;
    } else {
      let previous = this.head;
      
      for(let i = 0; i < index - 1; i++) {
        previous = previous.next;
      }

      element.next = previous.next;
      previous.next.prev = element;
      previous.next = element;
      element.prev = previous;
    }
    
    this.tail.next = this.head;
    this.head.prev = this.tail;

    this.#size += 1;
    return this.size;
  }
  
  remove(index = 0) {
    if (index < 0 || index >= this.size) return null;

    let removedElement = this.head;

    if (index === 0) {
      this.head.next.prev = null;
      this.head = this.head.next;
    } else if(index === this.size - 1) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    } else {
      let previous = this.head;

      for(let i = 0; i < index - 1; i++) {
        previous = previous.next;
      }

      removedElement = previous.next;
      previous.next = removedElement.next;
      removedElement.next.prev = previous;
    }
    
    if(this.head && this.tail) {
      this.tail.next = this.head;
      this.head.prev = this.tail;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.#size -= 1;
    return removedElement.value;
  }
  
  toString() {
    if(!this.size) return '';
    
    let str = `${this.head.value}`;
    let current = this.head.next;
    
    while(current && current !== this.head) {
      str += `, ${current.value}`;
      current = current.next;
    }
    
    return str;
  }
}
