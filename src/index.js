'use strict'

const express = require('express')

const app = express()

const wrapAsAsync = handler => (req, res, next) => Promise.resolve(handler(req, res, next))
  .then(({ status = 200, data }) => res.status(status).send(data))
  .catch(e => {
    console.warn('uncaught error', e)
    next(e)
  })

const hello = (req, res) => {
  res.json({ data: 'hello' })
}
const helloPromise = new Promise(resolve => {
  console.log('hello-async')
  resolve({ data: 'hello-async' })
})
const helloAsync = async req => await helloPromise
app
  .get('/hello', hello)
  .get('/hello-async', wrapAsAsync(helloAsync))

app.listen(8080)

module.exports = app
