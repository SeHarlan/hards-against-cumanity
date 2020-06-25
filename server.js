const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

let port = 3000

io.on('connection', socket => {
  socket.on('FIRST_EVENT', () => {
    console.log('revieced on backend')
    io.emit('TEST_RECIEVED', {
      message: 'test has been recieved'
    })
  })

  socket.on('TEXT', (text) => {
    console.log('text from FE', text)
    socket.broadcast.emit('TEXT', text)
  })

  socket.on('CHOSEN_WHITE_CARD', (card) => {
    console.log(card)
    io.emit('CHOSEN_WHITE_CARD', card)
  })
})

nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})