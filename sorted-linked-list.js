class SortedLinkedList extends DoubleLinkedList {
  #sortingFunction;
  
  constructor(sortingFunction = null) {
    super();
    this.#sortingFunction = sortingFunction;
    
    if(typeof sortingFunction !== 'function') {
      this.#sortingFunction = (a, b) => {
        if(a === b) return 0;
        
        return a > b ? 1 : -1;
      }
    }
    
    this.push = undefined;
  }
  
  insert(item) {
    if(this.size === 0) {
      return super.insert(item);
    }
    
    const index = this.#getNextElementIndex(item);
    
    return super.insert(item, index);
  }
  
  #getNextElementIndex(item) {
    let current = this.head;
    let i = 0;
    
    for(; i< this.size; i++) {
      const res = this.#sortingFunction(item, current.value);
      
      if(!(res >= 0) || !res) return i;
      
      current = current.next;
    }
    
    return i;
  }
}
