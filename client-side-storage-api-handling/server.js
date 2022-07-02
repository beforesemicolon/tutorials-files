const express = require('express');
const http = require('http');
const cors = require('cors');

const PORT = 4500;
const app = express();

app.use(express.json());
app.use(cors());

const api = new express.Router();

let items = new Map();

api.use((req, res, next) => {
  console.log('Time: ', (new Date()).toString())
  console.log(`Request (${req.method}): `, `/api/todos${req.path}`, {params: req.params, body: req.body})
  next()
})

api
  .get('/', (req, res) => {
    res.json({
      data: Array.from(items.values())
    })
  })
  .get('/:id', (req, res) => {
    const item = items.get(req.params['id']);
    
    if (item) {
      res.json({
        data: item
      })
    } else {
      res.sendStatus(404)
    }
  })
  .post('/', (req, res) => {
    items.set(req.body['id'], req.body)
    
    res.json(req.body)
  })
  .delete('/:id', (req, res) => {
    if (req.params['id']) {
      items.delete(req.params['id']);
      res.sendStatus(200);
    } else {
      res.sendStatus(404)
    }
  })


app.use('/api/todos', api);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
})



