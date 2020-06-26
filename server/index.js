const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const Deck = require('../lib/Deck')
const { getCards } = require('../lib/nodeServices')

let port = process.env.PORT || 3000

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()


const cards = getCards()
const deck = new Deck(cards)

io.on('connection', socket => {

  //TESTING
  // socket.on('FIRST_EVENT', () => {
  //   console.log('revieced on backend')
  //   io.emit('TEST_RECIEVED', {
  //     message: 'test has been recieved'
  //   })
  // })

  // socket.on('TEXT', (text) => {
  //   console.log('text from FE', text)
  //   socket.broadcast.emit('TEXT', text)
  // })
  //TESTING

  socket.on('DRAW_BLACK_CARD', () => {
    io.emit('DRAW_BLACK_CARD', deck.drawBlackCard())
    io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
  })

  socket.on('DRAW_FULL_HAND', () => {
    socket.emit('DRAW_FULL_HAND', deck.drawWhiteCards(7))
    io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('CHOSE_WHITE_CARD', (card) => {
    console.log(card)
    io.emit('CHOSEN_WHITE_CARDS', card)
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