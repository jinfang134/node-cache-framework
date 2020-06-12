import { EnableCaching } from '../src/public-api'
import { UserService } from './UserService';

var express = require('express')
var app = express()

const service = new UserService();

app.use(EnableCaching({
  type: 'memory',
}))



app.get('/user', (req, res) => {
  let result = service.getUser(3243)
  console.log(result);
  res.json(result)
})

app.get('/clear', (req, res) => {
  let result = service.deleteAllUsers()
  console.log(result);
  res.json(result)
})


app.post('/user', (req, res) => {
  let result = service.saveUser(3243, {
    name: 'foobar',
    age: 2233
  })
  res.json(result)
})

const host: string = 'localhost'

// Listen the server on http://localhost:${port}
app.listen(8000, host);

console.info(`Run service on ${host}:8000`);