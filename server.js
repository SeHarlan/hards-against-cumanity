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
let disconectedUsernames = []
let blackCard = 'Tell the Card Czar to draw a black card'
let chosenWhiteCards = []

io.on('connection', socket => {

  // socket.on('CREATE_ROOM', (roomName) => {
  //   socket.join(roomName)
  // })

  socket.on('disconnect', () => {
    disconectedUsernames.push(socket.username)
  })

  io.emit('PLAYERS', players.players)
  io.emit('DRAW_BLACK_CARD', blackCard)
  io.emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
  io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
  io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)

  socket.on('JOIN_GAME', (name) => {
    let added = false

    if (disconectedUsernames.includes(name)) {
      added = players.reconnectPlayer(socket.id, name)

      const cards = players.getHand(socket.id)
      socket.emit('DRAW_FULL_HAND', cards)

      const updatedUsernames = disconectedUsernames.filter(username => username !== name)
      disconectedUsernames = updatedUsernames
    } else {
      added = players.addPlayer(socket.id, name)

      const cards = deck.drawWhiteCards(7)
      players.drawFullHand(socket.id, cards)
      socket.emit('DRAW_FULL_HAND', cards)
    }

    if (!added) {
      socket.emit('INVALID_SIGN_UP')
      return
    }

    io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)

    io.emit('PLAYERS', players.players)
    const currentPlayer = players.players.find(player => player.id === socket.id)
    socket.username = currentPlayer.name
  })

  socket.on('DRAW_BLACK_CARD', () => {
    blackCard = deck.drawBlackCard()
    io.emit('DRAW_BLACK_CARD', blackCard)
    io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
  })

  socket.on('DRAW_FULL_HAND', () => {
    const cards = deck.drawWhiteCards(7)
    players.drawFullHand(socket.id, cards)
    socket.emit('DRAW_FULL_HAND', cards)
    io.emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('CHOOSE_WHITE_CARD', (card) => {
    cardWithID = { card, id: socket.id }
    chosenWhiteCards.push(cardWithID)
    io.emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)

    const [newCard] = deck.drawWhiteCards(1)
    const hand = players.drawOneCard(socket.id, card, newCard)
    socket.emit("DRAW_ONE_CARD", hand)
  })

  socket.on('CHOOSE_WINNING_CARD', (card) => {
    parsedCard = JSON.parse(card)
    players.increaseScore(parsedCard.id)
    io.emit('PLAYERS', players.players)
    io.emit('WINNING_CARD', parsedCard.card)
  })

  socket.on('START_NEW_ROUND', () => {
    players.changeCzar()
    chosenWhiteCards = []
    io.emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
    blackCard = deck.drawBlackCard()
    io.emit('DRAW_BLACK_CARD', blackCard)
    io.emit('BLACK_DECK_COUNT', deck.blackDeck.length)
    io.emit('WINNING_CARD', '')
    io.emit('PLAYERS', players.players)
    io.emit('NEW_ROUND')
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