const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const Deck = require('./lib/Deck')
const Players = require('./lib/Players')
const { getCards } = require('./lib/nodeServices')

const port = parseInt(process.env.PORT, 10) || 3000

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()


const cards = getCards()
let deck = new Deck(cards)
const players = new Players()
const disconectedUsernames = []

io.on('connection', socket => {
  socket.on('disconnect', () => {
    disconectedUsernames.push(socket.username)
    console.log(disconectedUsernames)
  })

  io.emit('PLAYERS', players.players)

  socket.on('JOIN_GAME', (name) => {
    let added = false

    if (disconectedUsernames.includes(name)) {
      added = players.reconnectPlayer(socket.id, name)
    } else {
      added = players.addPlayer(socket.id, name)
    }

    if (!added) {
      socket.emit('INVALID_SIGN_UP')
      return
    }
    socket.emit('DRAW_FULL_HAND', deck.drawWhiteCards(7))
    io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
    io.emit('PLAYERS', players.players)
    const currentPlayer = players.players.find(player => player.id === socket.id)
    socket.username = currentPlayer.name

  })

  socket.on('DRAW_BLACK_CARD', () => {
    io.emit('DRAW_BLACK_CARD', deck.drawBlackCard())
    io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
  })

  socket.on('DRAW_FULL_HAND', () => {
    socket.emit('DRAW_FULL_HAND', deck.drawWhiteCards(7))
    io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('CHOOSE_WHITE_CARD', (card) => {
    cardWithID = { card, id: socket.id }
    io.emit('CHOSEN_WHITE_CARDS', cardWithID)
    socket.emit("DRAW_ONE_CARD", deck.drawWhiteCards(1))
  })

  socket.on('CHOOSE_WINNING_CARD', (card) => {
    parsedCard = JSON.parse(card)
    players.increaseScore(parsedCard.id)
    io.emit('WINNING_CARD', parsedCard.card)
  })

  socket.on('START_NEW_ROUND', () => {
    players.changeCzar()
    io.emit('NEW_ROUND')
    io.emit('DRAW_BLACK_CARD', deck.drawBlackCard())
    io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
    io.emit('WINNING_CARD', '')
    io.emit('PLAYERS', players.players)
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