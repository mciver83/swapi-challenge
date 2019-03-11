const express = require('express')

const Ctrl = require('./controller')

const app = express()
const port = 5000


app.get('/people', Ctrl.people)
app.get('/planets', Ctrl.planets)

app.listen(port, () => {
  console.log('listening on port', port)
})