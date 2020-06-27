class SortedLinkedList extends LinkedList {
  constructor(sortingFunction = null) {
    super();
    this._sortingFunction = sortingFunction;
    
    if(!sortingFunction || typeof sortingFunction !== 'function') {
      this._sortingFunction = (a, b) => {
        if(a === b) return 0;
        
        return a > b ? 1 : -1;
      }
    }
    
    this.push = undefined;
  }
    
  insert(element) {
    if(this.isEmpty) {
      return super.insert(element);
    }
    
    const index = this._getNextElementIndex(element);
    
    return super.insert(element, index);
  }
  
  _getNextElementIndex(element) {
    let current = this.head;
    let i = 0;
    
    for(; i< this.size; i++) {
      const res = this._sortingFunction(element, current.element);
      
      if(res === false || res === -1) return i;
      
      current = current.next;
    }
    
    return i;
  }
}















