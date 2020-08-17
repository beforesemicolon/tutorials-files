class BST {
  #root = null;
  #compare;
  
  constructor(compareFn = null) {
    if(compareFn && typeof compareFn === 'function') {
      this.#compare = compareFn;
    } else {
      this.#compare = (a, b) => {
        if(a > b) return BST.comparison.BIGGER;
        if(a < b) return BST.comparison.SMALLER;
      
        return BST.comparison.EQUAL;
      }
    }
  }
  
  get root() {
    return this.#root;
  }

  get min() {
    if(this.root === null) return null;
    
    return this.#minNode(this.root).key;
  }

  get max() {
    if(this.root === null) return null;
    
    return this.#maxNode(this.root).key;
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

  createNode(key) {
    return Object.seal({
      key, left: null, right: null
    })
  }

  insert(key) {
    const newNode = this.createNode(key);
    
    if(this.root === null) {
      this.#root = newNode;
    } else {
      this.#insertNode(newNode);
    }
  }

  print() {
    this.#printNode();
  }

  traverseInOrder(cb) {
    this.#inOrder(this.root, cb);
  }

  traverseReversedOrder(cb) {
    this.#reverseOrder(this.root, cb);
  }

  traversePreOrder(cb) {
    this.#preOrder(this.root, cb);
  }

  traversePostOrder(cb) {
    this.#postOrder(this.root, cb);
  }

  search(key) {
    return this.#searchTree(key);
  }

  remove(key) {
    this.#root = this.#removeNode(key);
  }

  #removeNode = (key, node = this.root) => {
    if(node === null) return null;

    if(this.#compare(key, node.key) === BST.comparison.SMALLER) {
      node.left = this.#removeNode(key, node.left);
      return node;
    }
    
    if(this.#compare(key, node.key) === BST.comparison.BIGGER) {
      node.right = this.#removeNode(key, node.right);
      return node;
    }
    
    if(node.left === null && node.right === null) {
      node = null;
    } else if(node.left === null) {
      node = node.right;
    } else if(node.right === null) {
      node = node.left;
    } else {
      const max = this.#maxNode(node.left);
      node.key = max.key;
      node.left = this.#removeNode(max.key, node.left)
    }

    return node;
  }
  
  #maxNode = (node) => {
    while(node && node.right) {
      node = node.right;
    }

    return node;
  }
  
  #minNode = (node) => {
    while(node && node.left) {
      node = node.left;
    }

    return node;
  }

  #searchTree = (key, node = this.root) => {
    if(node === null) return false;

    if(this.#compare(key, node.key) === BST.comparison.EQUAL) return true;
       
    if(this.#compare(key, node.key) === BST.comparison.SMALLER) {
       return this.#searchTree(key, node.left);
    }
    
    return this.#searchTree(key, node.right);
  }

  #postOrder = (node, cb) => {
    if(node !== null) {
      this.#postOrder(node.left, cb);
      this.#postOrder(node.right, cb);
      cb(node.key);
    }
  }

  #preOrder = (node, cb) => {
    if(node !== null) {
      cb(node.key);
      this.#preOrder(node.left, cb);
      this.#preOrder(node.right, cb);
    }
  }

  #reverseOrder = (node, cb) => {
    if(node !== null) {
      this.#reverseOrder(node.right, cb);
      cb(node.key);
      this.#reverseOrder(node.left, cb);
    }
  }

  #inOrder = (node, cb) => {
    if(node !== null) {
      this.#inOrder(node.left, cb);
      cb(node.key);
      this.#inOrder(node.right, cb);
    }
  }

  #insertNode = (newNode, currentNode = this.root) => {
    if(this.#compare(newNode.key, currentNode.key) === BST.comparison.SMALLER) {
       if(currentNode.left === null) {
         currentNode.left = newNode;
       } else {
        this.#insertNode(newNode, currentNode.left)
      }                            
    } else {
       if(currentNode.right === null) {
         currentNode.right = newNode;
       } else {
         this.#insertNode(newNode, currentNode.right)
       }  
    }
  }
  
  #printNode = (node = this.root, spaceCount = 0, label = '* ') => {
    if(node === null) {
      return console.log(`${' -'.repeat(spaceCount)}${label}null`);
    }

    console.log(`${' -'.repeat(spaceCount)}${label}${node.key}`);
    this.#printNode(node.right, spaceCount + 2, 'R: ');
    this.#printNode(node.left, spaceCount + 2, 'L: ');
  }
}











