class Graph {
  #vertices = new Set();
  #adjacentList = new Map();
  
  get vertices() {
    return Array.from(this.#vertices)
  }
  
  get adjacentList() {
    const list = {};
    
    this.#adjacentList.forEach((val, key) => {
      list[key] = Array.from(val)
    })
    
    return list
  }
  
  addVertex(vertex = null) {
    if(vertex !== null && vertex !== undefined) {
      this.#vertices.add(vertex);
      this.#adjacentList.set(vertex, new Set());
    }
  }
  
  addEdge(vertex1 = null, vertex2 = null, directed = true) {
    if(
      vertex1 !== null && vertex1 !== undefined &&
      vertex2 !== null && vertex2 !== undefined && 
      vertex1 != vertex2
    ) {
      if(!this.#adjacentList.has(vertex1)) {
        this.addVertex(vertex1);
      }

      if(!this.#adjacentList.has(vertex2)) {
        this.addVertex(vertex2);
      }

      this.#adjacentList.get(vertex1).add(vertex2);

      if(directed) {
        this.#adjacentList.get(vertex2).add(vertex1);
      }
    }
  }
  
  toString() {
    let str = '';
    
    this.#adjacentList.forEach((val, key) => {
      str += `${key} -> ${Array.from(val).join(', ')};\n`;
    });
    
    return str;
  }
}

const COLORS = Object.freeze({
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red'
});

function breathFirstSearch(graph, fromVertex, callback) {
  const {vertices, adjacentList} = graph;
  
  if(vertices.length === 0) return;
  
  const color = vertices.reduce((c, v) => ({...c, [v]: COLORS.GREEN}), {});
  const queue = [];
  
  queue.push(fromVertex);
  
  while(queue.length) {
    const v = queue.shift();
    const nearVertex = adjacentList[v];
    color[v] = COLORS.YELLOW;
    
    nearVertex.forEach(w => {
      if(color[w] === COLORS.GREEN) {
        color[w] = COLORS.YELLOW;
        queue.push(w);
      }
    });
    
    color[v] = COLORS.RED;
    
    callback && callback(v);
  }
}

function depthFirstSearch(graph, fromVertex, callback) {
  const {vertices, adjacentList} = graph;
  
  if(vertices.length === 0) return;
  
  const color = vertices.reduce((c, v) => ({...c, [v]: COLORS.GREEN}), {});
  
  callback && callback(fromVertex);
  color[fromVertex] = COLORS.YELLOW;
  
  function visit(v) {
    if(color[v] === COLORS.GREEN) {
      callback && callback(v);
      color[v] = COLORS.YELLOW;
      adjacentList[v].forEach(visit);
    }
    color[v] = COLORS.RED;
  }
  
  adjacentList[fromVertex].forEach(visit);
}
