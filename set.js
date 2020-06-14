class SetExtended extends Set {
  #isValidSet = (set) => {
    return set && set instanceof Set && set.size > 0;
  };

  isSubsetOf(set) {
    if (!this.#isValidSet(set)) return false;
        
    return this.size <= set.size && [...this].every(item => set.has(item))
  }

  isSupersetOf(set) {
    if (!this.#isValidSet(set)) return false;
        
    return this.size >= set.size && [...set].every(item => this.has(item))
  }

  union(set) {
    if (!this.#isValidSet(set)) return this;

    return new SetExtended([...this, ...set]);
  }

  difference(set) {
    if (!this.#isValidSet(set)) return this;

    const differenceSet = new SetExtended();

    this.forEach((item) => {
      if (!set.has(item)) differenceSet.add(item);
    });

    return differenceSet;
  }

  intersect(set) {
    const intersectionSet = new SetExtended();

    if (!this.#isValidSet(set)) return intersectionSet;
        
    const [smallerSet, biggerSet] =
      set.size <= this.size ? [set, this] : [this, set];

    smallerSet.forEach((item) => {
      if (biggerSet.has(item)) intersectionSet.add(item);
    });

    return intersectionSet;
  }

  intersectionDifference(set) {
    if (!this.#isValidSet(set)) return this;
        
    return new SetExtended([
      ...this.difference(set),
      ...set.difference(this),
    ]);
  }
}


class StaticSet extends SetExtended {
  constructor(items) {
    super(items);
    
    delete this.add;
    delete this.delete;
    delete this.clear;
  }
  
  // OPTIONAL
  // to also make the items in the set readonly
  // overide the forEach, keys, values and entries as well
  #items = () => [...this].map(item => {
  
     if(item instanceof Map) {
       item = new Map(Array.from(item.entries()))
     } else if(item instanceof Set) {
       item = new Set(Array.from(item.values()))
     } else if(item && typeof item === 'object') {
       Object.freeze(item);
     } 

     return item;
  });

  forEach(cb) {
    this.#items().forEach(cb)
  }

  keys() {
    return this.#items().values();
  }
  
  values() {
    return this.#items().values();
  }

  entries() {
    return this.#items().map(item => ([item, item]));
  }
}













