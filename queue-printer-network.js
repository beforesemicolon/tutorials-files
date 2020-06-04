class Queue {
  #list = [];
  #capacity = null;

  constructor(capacity) {
    this.#capacity = Math.max(Number(capacity), 0) || null;
  }

  get size() {
    return this.#list.length;
  }

  get isEmpty() {
    return this.size === 0;
  }

  get isFull() {
    return this.#capacity !== null && this.size === this.#capacity;
  }

  enqueue(item) {
    if (this.#capacity === null || this.size < this.#capacity) {
      return this.#list.push(item);
    }

    return this.size;
  }

  dequeue() {
    return this.#list.shift();
  }

  peek() {
    return this.#list[0];
  }

  print() {
    console.log(this.#list);
  }
}


class Printer extends Queue {
  constructor() {
    super(10);

    this.id = Math.floor(Math.random() * 10000);
  }

  print(doc) {
    return new Promise((res, rej) => {
      if (this.isFull) {
        rej("Printer is full");
      } else {
        this.enqueue(doc);
        setTimeout(() => {
          this.dequeue();
          res();
        }, 2000);
      }
    });
  }
}

class PrinterNetwork extends Queue {
  #printers = [new Printer(), new Printer(), new Printer()];
  
  print(doc) {
    return new Promise((res) => {
      const freePrinter = this.#printers.reduce((acc, p) => {
        if (p.size < acc.size) {
          acc = p;
        }

        return acc;
      }, this.#printers[0]);

      if (freePrinter.isFull) {
        this.enqueue(() => this.print(doc).then((id) => res(id)));
      } else {
        freePrinter.print(doc).then(() => {
          res(freePrinter.id);
          if (this.size) {
            const nextDoc = this.dequeue();
            nextDoc();
          }
        });
      }
    });
  }
}
