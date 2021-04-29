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

  intersection(set) {
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
    
    this.add = undefined;
    this.delete = undefined;
    this.clear = undefined;
  }
}













