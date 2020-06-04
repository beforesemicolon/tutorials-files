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

// const printer = new Printer();

// Array.from({ length: 15 }, (_, i) => i + 1).forEach((n) => {
//   printer.print(n)
//     .then(() => console.log(n, "done"))
//     .catch(msg => console.log(n, msg))
// });

class PrinterNetwork extends Queue {
  #printers = [new Printer(), new Printer(), new Printer()];

  //     print(doc) {
  //       return new Promise((res) => {
  //         const freePrinter = this.#printers.find((printer) => !printer.isFull());

  //         if (freePrinter) {
  //           freePrinter.print(doc).then(() => {
  //             res(freePrinter.id);
  //             if (this.size) {
  //               const nextDoc = this.dequeue();
  //               nextDoc();
  //             }
  //           });
  //         } else {
  //           this.enqueue(() => this.print(doc).then((id) => res(id)));
  //         }
  //       });
  //     }

  print(doc) {
    return new Promise((res) => {
      const freePrinter = this.#printers.reduce((acc, p) => {
        if (p.size < acc.size) {
          acc = p;
        }

        return acc;
      }, this.#printers[0]);

      if (freePrinter.isFull()) {
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

const printers = new PrinterNetwork();

Array.from({ length: 10 }, (_, i) => i + 1).forEach((n) => {
  printers
    .print(n)
    .then((printerId) => console.log(n, "printed by", printerId));
});
