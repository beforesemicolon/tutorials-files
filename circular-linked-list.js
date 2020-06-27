class CircularLinkedList extends LinkedList {
  push(element) {
    const node = this.createNode(element);

    if (!this.head) {
      this.head = node;
    } else {
      const current = this.getNodeAt(this.size - 1);
      current.next = node;
    }

    node.next = this.head;

    this.size += 1;
    return this.size;
  }

  insert(element, index = 0) {
    if (index > this.size) return false;

    const node = this.createNode(element);

    if (index === 0) {
      node.next = this.head;
      
      if(this.isEmpty) {
        node.next = node;
      } else {
        const last = this.getNodeAt(this.size - 1);
        last.next = node;
      }
      
      this.head = node;
    } else {
      const previous = this.getNodeAt(index - 1);
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
      if (this.size === 1) {
        this.head = null;
      } else {
        const last = this.getNodeAt(this.size - 1);
        this.head = this.head.next;
        last.next = this.head;
      }
    } else {
      let previous = this.getNodeAt(index - 1);
      removedNode = previous.next;
      previous.next = removedNode.next;
    }

    this.size -= 1;
    return removedNode.element;
  }
}

class CircularDoubleLinkedList extends DoubleLinkedList {
  push(element) {
    const node = this.createNode(element);

    if (!this.head) {
      this.head = node;
    } else {
      const current = this.getNodeAt(this.size - 1);
      current.next = node;
      node.prev = current;
    }

    this.tail = node;
    this.tail.next = this.head;

    this.size += 1;
    return this.size;
  }

  insert(element, index = 0) {
    if (index > this.size) return false;

    const node = this.createNode(element);

    if (index === 0) {
      if (this.head) {
        node.next = this.head;
        this.head.prev = node;
      } else {
        this.tail = node;
      }
      this.head = node;
      this.tail.next = this.head;
    } else if (index === this.size) {
      this.tail.next = node;
      node.prev = this.tail;
      node.next = this.head;
      this.tail = node;
    } else {
      const current = this.getNodeAt(index);
      const prev = current.prev;

      prev.next = node;
      current.prev = node;
      node.prev = prev;
      node.next = current;
    }

    this.size = this.size + 1;

    return true;
  }

  remove(index = 0) {
    if (index > this.size) return null;

    let removedNode = this.head;

    if (index === 0) {
      this.head = removedNode.next;
      if (this.size === 1) {
        this.tail = null;
      } else {
        this.head.prev = null;
        this.tail.next = this.head;
      }
    } else if (index === this.size - 1) {
      removedNode = this.tail;
      this.tail = removedNode.prev;
      this.tail.next = this.head;
    } else {
      removedNode = this.getNodeAt(index);
      const previous = removedNode.prev;
      const next = removedNode.next;

      previous.next = next;
      next.prev = previous;
    }

    this.size = this.size - 1;
    return removedNode;
  }
}
