class Stack {
  #list = [];
  #capacity = null;

  constructor(capacity = null) {
    this.#capacity = capacity;
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

//   push(item) {
//     if (!this.#capacity || this.size < this.#capacity) {
//       this.#list.push(item);
//     }
    
//     return this.size;
//   }
  
  push(item) {
   if (this.#capacity && this.size === this.#capacity) {
      this.#list.shift();    
   }
    
   return this.#list.push(item);
  }

  pop() {
    return this.pop();
  }

  peek() {
    return this.#list[this.size - 1];
  }

  toString() {
    return this.#list.toString();
  }
}
