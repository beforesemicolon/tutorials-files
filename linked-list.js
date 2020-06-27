class LinkedList {
  size = 0;
  head = null;

  get isEmpty() {
    return this.size === 0;
  }

  createNode(element) {
    return {element, next: null}
  }

  getNodeAt(index) {
    if (index === undefined || index < 0 || index >= this.size) return null;

    if (index === 0) return this.head;
    
    let current = this.head;
    
    for(let i = 0; i < index; i++) {
      current = current.next;
    }

    return current;
  }

  push_(element) {
    const node = this.createNode(element);

    if (!this.head) {
      this.head = node;
    } else {
      const current = this.getNodeAt(this.size - 1);
      current.next = node;
    }

    this.size += 1;
    return this.size;
  }

  push(element) {
    const node = this.createNode(element);

    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;

      while (current.next !== null) {
        current = current.next;
      }

      current.next = node;
    }

    this.size += 1;
    return this.size;
  }

  insert_(element, index = 0) {
    if (index > this.size) return false;

    const node = this.createNode(element);
    let current = this.head;

    if (index === 0) {
      node.next = current;
      this.head = node;
    } else {
      current = this.getNodeAt(index - 1);
      node.next = current.next;
      current.next = node;
    }

    this.size += 1;
    return true;
  }

  insert(element, index = 0) {
    if (index < 0 || index > this.size) return false;

    const node = this.createNode(element);

    if (index === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let previous = this.head;
      
      for(let i = 0; i < index - 1; i++) {
        previous = previous.next;
      }

      node.next = previous.next;
      previous.next = node;
    }

    this.size += 1;
    return true;
  }

  remove(index = 0) {
    if (index < 0 || index > this.size) return null;

    let removedNode = this.head;

    if (index === 0) {
      this.head = this.head.next;
    } else {
      let previous = this.getNodeAt(index - 1);
      removedNode = previous.next;
      previous.next = removedNode.next;
    }

    this.size -= 1;
    return removedNode.element;
  }

  get(index) {
    const node = this.getNodeAt(index);
    return node ? node.element : null;
  }

  indexOf(element) {
    let current = this.head;

    if (current.element === element) return 0;
    
    for(let i = 0; i < this.size; i++) {
      if (current.element === element) return i;
      current = current.next;
    }

    return -1;
  }

  contains(element) {
    return this.indexOf(element) !== -1;
  }

  toString() {
    if (!this.size) return "";

    let str = `${this.head.element}`;
    let current = this.head;
    
    for(let i=0; i < this.size - 1; i++) {
      current = current.next;
      str += `,${current.element}`;
    }
    
    return str;
  }

  print() {
    let arr = [];

    if (this.size) {
      let current = this.head;
      
      for(let i=0; i < this.size; i++) {
        arr.push(current);
        current = current.next;
      }
    }

    console.log(arr);
  }
}
