const defaultCompareFunction = (a, b) => {
  console.log('--', a, b)
  if(a > b) return MinHeap.comparison.BIGGER;
  if(a < b) return MinHeap.comparison.SMALLER;

  return MinHeap.comparison.EQUAL;
}

class MinHeap {
  #heap = [];
  #compare;
  
  constructor(compareFn = defaultCompareFunction) {
    this.#compare = compareFn;
  }
  
  static get comparison() {
    return Object.freeze({
      BIGGER: 1,
      BIGGER_OR_EQUAL: [1, 0],
      SMALLER: -1,
      SMALLER_OR_EQUAL: [-1, 0],
      EQUAL: 0
    })
  }
  
  get size() {
    return this.#heap.length;
  }
  
  get isEmpty() {
    return this.size === 0;
  }
  
  get min() {
    return this.isEmpty ? null : this.#heap[0];
  }
  
  insert(value) {
    if(value !== null && value !== undefined) {
      this.#heap.push(value);
      this.#siftUp(this.size - 1);
      
      return true;
    }
    
    return false;
  }
  
  extract() {
    if(this.isEmpty) return null;
    
    if(this.size === 1) return this.#heap.shift();
    
    const removedNode = this.#heap.shift();
    
    this.#siftDown(0);
    
    return removedNode;
  }
  
  print() {
    this.#printNode(0);
  }
  
  #siftUp(index) {
    let parentIdx = this.#getParentIndex(index);
    
    while(
      index > 0 &&
      this.#compare(this.#heap[parentIdx], this.#heap[index]) === MinHeap.comparison.BIGGER
    ) {
      this.#swap(parentIdx, index);
      index = parentIdx;
      parentIdx = this.#getParentIndex(index);
    }
  }
  
  #siftDown(index) {
    let currentIndex = index;
    const leftIndex = this.#getLeftIndex(index);
    const rightIndex = this.#getRightIndex(index);
    
    if(
      leftIndex < this.size &&
      this.#compare(this.#heap[currentIndex], this.#heap[leftIndex]) === MinHeap.comparison.BIGGER
    ) {
      currentIndex = leftIndex;
    }
    
    if(
      rightIndex < this.size &&
      this.#compare(this.#heap[currentIndex], this.#heap[rightIndex]) === MinHeap.comparison.BIGGER
    ) {
      currentIndex = rightIndex;
    }
    
    if(currentIndex !== index) {
      this.#swap(index, currentIndex);
      this.#siftDown(currentIndex);
    }
  }
  
  #swap(i, j) {
    // const temp = this.#heap[i];
    // this.#heap[i] = this.#heap[j];
    // this.#heap[j] = temp;
    [this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]]
  }
  
  #printNode(i = 0, spaceCount = 0, label = '*') {
    if(i >= this.size) return;
    
    console.log(`${' '.repeat(spaceCount)}${label}: ${this.#heap[i]} [${i}]`);
    
    this.#printNode(this.#getLeftIndex(i), spaceCount + 3, 'L');
    this.#printNode(this.#getRightIndex(i), spaceCount + 3, 'R');
  }
  
  #getLeftIndex(index) {
    return 2 * index + 1;
  }
  
  #getRightIndex(index) {
    return 2 * index + 2;
  }
  
  #getParentIndex(index) {
    if(index === 0) return null;
    
    return Math.floor((index - 1) / 2)
  }
}

class MaxHeap extends MinHeap {
  constructor(compareFn = defaultCompareFunction) {    
    super((a, b) => compareFn(b, a))
  }
}
