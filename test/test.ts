import { EnableCaching, CacheConfig, Cacheable, CacheEvict } from '../src/public-api'

var express = require('express')
var app = express()

app.use(EnableCaching({
  type: 'memory',
}))

// initCache({
//   type: 'memory'
// })

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

@CacheConfig('hello')
class Hello {

  @Cacheable({
    key: '${id}_${name}'
  })
  sayHello(id: number, name: string) {
    console.log('load from method.')
    return 'hello'
  }



  @CacheEvict({ allEntries: true })
  clear() {
    console.log('clear cache')
  }
}

app.use('/', (req, res) => {
  let result = new Hello().sayHello(2, 'zuo_ji')
  console.log(result);
  res.json(result)
})

app.use('/clear', (req, res) => {
  let result = new Hello().clear()
  console.log(result);
  res.json(result)
})


const host: string = 'localhost'

// Listen the server on http://localhost:${port}
app.listen(8000, host);

console.info(`Run service on ${host}:8000`);