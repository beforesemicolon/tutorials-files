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
    while(node && node.right && node.right.key !== null) {
      node = node.right;
    }

    return node;
  }
  
  #minNode = (node) => {
    while(node && node.left && node.left.key !== null) {
      node = node.left;
    }

    return node;
  }

  #searchTree = (key, node = this.root) => {
    if(node === null || node.key === null) return false;

    if(this.#compare(key, node.key) === BST.comparison.EQUAL) return true;
       
    if(this.#compare(key, node.key) === BST.comparison.SMALLER) {
       return this.#searchTree(key, node.left);
    }
    
    return this.#searchTree(key, node.right);
  }

  #postOrder = (node, cb) => {
    if(node !== null && node.key !== null) {
      this.#postOrder(node.left, cb);
      this.#postOrder(node.right, cb);
      cb(node.key);
    }
  }

  #preOrder = (node, cb) => {
    if(node !== null && node.key !== null) {
      cb(node.key);
      this.#preOrder(node.left, cb);
      this.#preOrder(node.right, cb);
    }
  }

  #reverseOrder = (node, cb) => {
    if(node !== null && node.key !== null) {
      this.#reverseOrder(node.right, cb);
      cb(node.key);
      this.#reverseOrder(node.left, cb);
    }
  }

  #inOrder = (node, cb) => {
    if(node !== null && node.key !== null) {
      this.#inOrder(node.left, cb);
      cb(node.key);
      this.#inOrder(node.right, cb);
    }
  }

  #insertNode = (newNode, currentNode = this.root) => {
    if(BST.comparison.SMALLER_OR_EQUAL.includes(this.#compare(newNode.key, currentNode.key))) {
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

const COLOR = Object.freeze({
  RED: 'red',
  BLACK: 'black'
})

class RedBlackNode {
  #color;
  left = null;
  right = null;
  
  constructor(key = null, parent = null) {
    this.key = key;
    this.parent = parent;
    
    if(key == null) {
      this.#color = COLOR.BLACK;
    } else {
      this.#color = COLOR.RED;
      this.left = new RedBlackNode(null, this);
      this.right = new RedBlackNode(null, this);
    }
  }
  
  get isRed() {
    return this.color === COLOR.RED;
  }
  
  get isBlack() {
    return !this.isRed
  }
  
  get isNil() {
    return this.key === null;
  }
  
  get color() {
    return this.#color;
  }
  
  set color(newColor) {
    if(!this.isNil) {
       this.#color = newColor;
    }
  }
}

class RBTree extends BST {
  #root = null;
  #compare;
  
  constructor(compareFn = null) {
    let fn = null;
    
    if(compareFn && typeof compareFn === 'function') {
      fn = compareFn;
    } else {
      fn = (a, b) => {
        if(a > b) return BST.comparison.BIGGER;
        if(a < b) return BST.comparison.SMALLER;
      
        return BST.comparison.EQUAL;
      }
    }

    super(fn);
    this.#compare = fn;
  }
  
  get root() {
    return this.#root;
  }
  
  createNode(key = null, parent = null) {
    return new RedBlackNode(key, parent);
  }
  
  insert(key) {
    const newNode = this.createNode(key);
    
    if(this.root === null) {
      this.#root = newNode;
    } else {
      this.#insertNode(newNode);
    }
    
    this.#adjustTreeAfterInsertion(newNode);
  }
  
  remove(key) {
    this.#removeNode(key);
  }
  
  #getNodeSibling(node) {
    const parentNode = node.parent;
    const sibNode = parentNode.left === node
      ? parentNode.right
      : parentNode.left;
    
    return sibNode;
  }
  
  #handleCase2(node) {
    // sibling is red with 2 black children
    const sibNode = this.#getNodeSibling(node);

    if(sibNode.isRed) {
      const parentNode = node.parent;
    
      sibNode.color = COLOR.BLACK;
      parentNode.color = COLOR.RED;

      if(node === parentNode.left) {
        this.#LRotation(parentNode);
      } else {
        this.#RRotation(parentNode);
      }
    }
    
    this.#handleCase3(node);
  }
  
  #handleCase3(node) {
    // node parent is black, sibling and its children are black
    const sibNode = this.#getNodeSibling(node);
    
    if(
      node.parent.isBlack && 
      sibNode.isBlack && 
      sibNode.left.isBlack && 
      sibNode.right.isBlack
    ) {
      sibNode.color = COLOR.RED;
      this.#handleRemovedNode(node.parent);
    } else {
      this.#handleCase4(node);
    }
  }
  
  #handleCase4(node) {
    // node parent is red, sibling and its children are black
    const sibNode = this.#getNodeSibling(node);
    
    if(
      node.parent.isRed && 
      sibNode.isBlack && 
      sibNode.left.isBlack && 
      sibNode.right.isBlack
    ) {
      sibNode.color = COLOR.RED;
      node.parent.color = COLOR.BLACK;
    } else {
      this.#handleCase5(node);
    }
  }
  
  #handleCase5(node) {
    // sib is black with red left and black right
    const sibNode = this.#getNodeSibling(node);
    
    if(sibNode.isBlack) {
      const parentNode = node.parent;
    
      if(node === parentNode.left && sibNode.left.isRed && sibNode.right.isBlack) {
        sibNode.color = COLOR.RED;
        sibNode.left.color = COLOR.BLACK;
        this.#RRotation(sibNode);
      }

      if(node === parentNode.right && sibNode.left.isBlack && sibNode.right.isRed) {
        sibNode.color = COLOR.RED;
        sibNode.right.color = COLOR.BLACK;
        this.#LRotation(sibNode);
      }
    }
   
    this.#handleCase6(node);
  }
  
  #handleCase6(node) {
    // sib is black with red right and black left
    const sibNode = this.#getNodeSibling(node);
    const parentNode = node.parent;
      
    sibNode.color = parentNode.color;
    parentNode.color = COLOR.BLACK;

    if(node === parentNode.left) {
      sibNode.right.color = COLOR.BLACK;
      this.#LRotation(parentNode);
    } else {
      sibNode.left.color = COLOR.BLACK;
      this.#RRotation(parentNode);
    }
  }
  
  #handleRemovedNode(node) {
    // console.log('case 1', node.key);
    // node is black and with a parent
    if(node.isBlack && node.parent !== null) {// case 1
      this.#handleCase2(node);
    }
  }
  
  #removeNode = (key, node = this.root) => {
    if(node === null || node.isNil) return;

    if(this.#compare(key, node.key) === BST.comparison.SMALLER) {
      this.#removeNode(key, node.left);
    } else if(this.#compare(key, node.key) === BST.comparison.BIGGER) {
      this.#removeNode(key, node.right);
    } else if(node.left.isNil && node.right.isNil) {
      // console.log('remove 1', node.key)
      this.#handleRemovedNode(node);
      
      if(node.parent === null) {
        this.#root = null;
      } else if(node === node.parent.left) {
        node.parent.left = this.createNode(null, node);
      } else {
        node.parent.right = this.createNode(null, node);
      }
    } else if(node.left.isNil) {
      // console.log('remove 2', node.key)
      node.key = node.right.key;
      node.right = this.createNode(null, node);
    } else if(node.right.isNil) {
      // console.log('remove 3', node.key)
      node.key = node.left.key;
      node.left = this.createNode(null, node);
    } else {
      const max = this.#maxNode(node.left);
      // console.log('remove 4', node.key)
      node.key = max.key;
      this.#removeNode(max.key, node.left);
    }
  }
  
  #maxNode = (node) => {
    while(node && !node.isNill && !node.right.isNil) {
      node = node.right;
    }

    return node;
  }
  
  #insertNode = (newNode, currentNode = this.root) => {
    if(this.#compare(newNode.key, currentNode.key) === BST.comparison.SMALLER) {
       if(currentNode.left.isNil) {
         currentNode.left = newNode;
         newNode.parent = currentNode;
       } else {
        this.#insertNode(newNode, currentNode.left)
      }                            
    } else {
       if(currentNode.right.isNil) {
         currentNode.right = newNode;
         newNode.parent = currentNode;
       } else {
         this.#insertNode(newNode, currentNode.right)
       }  
    }
  }
  
  #RRotation = (node) => {
    if(node.left) {
      // console.log('r rotate', node.key);
      const nodeParent = node.parent;
      const detached = node.left;
      node.left = detached.right;
      detached.right = node;
      node.parent = detached;
      
      if(node.left !== null) {
        node.left.parent = node;
      }
      
      if(nodeParent !== null) {
        if(node === nodeParent.left) {
          nodeParent.left = detached;
        } else {
          nodeParent.right = detached;
        }
      } else {
        this.#root = detached;
      }
      
      detached.parent = nodeParent;
    }
  }
  
  #LRotation = (node) => {
    if(node.right) {
      // console.log('l rotate', node.key);
      const nodeParent = node.parent;
      const detached = node.right;
      node.right = detached.left;
      detached.left = node;
      node.parent = detached;
      
      if(node.right !== null) {
        node.right.parent = node;
      }
      
      if(nodeParent !== null) {
        if(node === nodeParent.left) {
          nodeParent.left = detached;
        } else {
          nodeParent.right = detached;
        }
      } else {
        this.#root = detached;
      }
      
      detached.parent = nodeParent;
    }
  }
  
  #handleRedUncle(parentNode, uncleNode, grandParentNode) {
    parentNode.color = COLOR.BLACK;
    uncleNode.color = COLOR.BLACK;
    grandParentNode.color = COLOR.RED;
    this.#adjustTreeAfterInsertion(grandParentNode);
  }
  
  #recolorMidNode(node) {
    node.color = COLOR.BLACK;
    node.parent.color = COLOR.RED;
  }
  
  #handleBlackUncle(node) {
    const parentNode = node.parent;
    
    if(node === parentNode.left) {
      if(parentNode === parentNode.parent.left) {
        this.#recolorMidNode(parentNode);
        this.#RRotation(parentNode.parent);
      } else {
        this.#RRotation(parentNode);
        this.#recolorMidNode(node);
        this.#LRotation(node.parent);
      }
    } else {
      if(parentNode === parentNode.parent.right) {
        this.#recolorMidNode(parentNode);
        this.#LRotation(parentNode.parent);
      } else {
        this.#LRotation(parentNode);
        this.#recolorMidNode(node);
        this.#RRotation(node.parent);
      }
    }
  }
  
  #adjustTreeAfterInsertion(node) {
    if(node.parent === null) {
      node.color = COLOR.BLACK;
    } else if(node.parent.isRed) {
      const parentNode = node.parent;
      const grandParentNode = parentNode.parent;
      const uncleNode = grandParentNode.left === parentNode
        ? grandParentNode.right
        : grandParentNode.left;
      
      if(uncleNode.isBlack) {
        // console.log('red parent blk uncle')
        this.#handleBlackUncle(node);
      } else {
        // console.log('red parent red uncle')
        this.#handleRedUncle(parentNode, uncleNode, grandParentNode)
      }
    }
  }
  
  print() {
    this.#printNode();
  }
  
  #printNode = (node = this.root, spaceCount = 0, label = '* ') => {
    if (node == null) return;
    
    console.log(`${' -'.repeat(spaceCount)}${label}${node.key} (${node.color})`);
    
    if (node.isNil) return;
    
    this.#printNode(node.right, spaceCount + 2, 'R: ');
    this.#printNode(node.left, spaceCount + 2, 'L: ');
  }
}
