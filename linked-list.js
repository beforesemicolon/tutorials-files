class LinkedList {
  #size = 0;
  head = null;
  
  constructor() {
    this[Symbol.iterator] = function* () {
      let current = this.head;

      while(current) {
        yield current.value;
        current = current.next;
      }
    };
  }
  
  get size() {
    return this.#size;
  }
  
  createElement(value) {
    return {value, next: null}
  }
  
  push(item) {
    const element = this.createElement(item);
    
    if(this.head === null) {
      this.head = element;
    } else {
      let current = this.head;

      while (current.next !== null) {
        current = current.next;
      }

      current.next = element;
    }
    
    this.#size += 1;
    return this.size;
  }
  
  insert(item, index = 0) {
    if (index < 0 || index > this.size) return;
    
    if(index === this.size) {
      return this.push(item);
    }

    const element = this.createElement(item);

    if (index === 0) {
      element.next = this.head;
      this.head = element;
    } else {
      let previous = this.head;
      
      for(let i = 0; i < index - 1; i++) {
        previous = previous.next;
      }

      element.next = previous.next;
      previous.next = element;
    }

    this.#size += 1;
    return this.size;
  }
  
  remove(index = 0) {
    if (index < 0 || index >= this.size) return null;

    let removedElement = this.head;

    if (index === 0) {
      this.head = this.head.next;
    } else {
      let previous = this.head;
      
      for(let i = 0; i < index - 1; i++) {
        previous = previous.next;
      }
      
      removedElement = previous.next;
      previous.next = removedElement.next;
    }

    this.#size -= 1;
    return removedElement.value;
  }
  
  get(index = -1) {
    if (index < 0 || index >= this.size -1) return null;
    
    let element = this.head;

    for(let i = 0; i < index; i++) {
      element = element.next;
    }
    
    return element.value;
  }
  
  forEach(cb) {
    let current = this.head;
    let index = 0;
    
    while(current) {
      cb(current.value, index);
      current = current.next;
      index += 1;
    }
  }
  
  find(cb) {
    let current = this.head;
    let result = null;
    
    while(current) {
      const matched = cb(current.value);
      
      if(matched) {
        result = current;
        break;
      }
      
      current = current.next;
    }
    
    return result?.value ?? null;
  }
  
  indexOf(item) {
    let current = this.head;

    if (current.value === item) return 0;
    
    for(let i = 0; i < this.size; i++) {
      if (current.value === item) return i;
      current = current.next;
    }

    return -1;
  }
  
  toString() {
    if(!this.size) return '';
    
    let str = `${this.head.value}`;
    let current = this.head.next;
    
    while(current) {
      str += `, ${current.value}`;
      current = current.next;
    }
    
    return str;
  }

  reverse() {
    let previous = this.head;
    let current = this.head.next;
    previous.next = null;
    
    while(current) {
      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }
    
    this.head = previous;
  }
}
