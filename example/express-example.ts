import { EnableCaching } from '../src/public-api'
import { UserService } from './UserService';

const express = require('express')
const app = express()

const service = new UserService();

app.use(EnableCaching({

}))



app.get('/user', (req, res) => {
  const result = service.getUser(3243)
  console.log(result);
  res.json(result)
})

app.get('/clear', (req, res) => {
  const result = service.deleteAllUsers()
  console.log(result);
  res.json(result)
})


app.post('/user', (req, res) => {
  const result = service.saveUser(3243, {
    name: 'foobar',
    age: 2233
  })
  res.json(result)
})

const host: string = 'localhost'

// Listen the server on http://localhost:${port}
app.listen(8000, host);

console.info(`Run service on ${host}:8000`);