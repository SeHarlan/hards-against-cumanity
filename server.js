const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const Deck = require('./lib/Deck')
const Players = require('./lib/Players')
const { getCards } = require('./lib/nodeServices')

const port = process.env.PORT || 3000

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()


//NOT DYNAMIC
const cards = getCards()
let deck = new Deck(cards)
const players = new Players()
let disconectedUsernames = []
let blackCard = 'Tell the Card Czar to draw a black card!'
let chosenWhiteCards = []
let roomName = 'GameTable'

io.on('connection', socket => {
  socket.on('CREATE_ROOM', (room) => {
    socket.join(room)
    socket.room = room
    roomName = room

    console.log('created socket room: ', socket.room)
  })

  socket.on('disconnect', () => {
    disconectedUsernames.push(socket.username)
    const index = chosenWhiteCards.findIndex(card => card.id === socket.id)
    if (index !== -1) chosenWhiteCards.splice(index, 1)
    io.to(roomName).emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
  })


  socket.on('JOIN_GAME', (name, room) => {
    console.log('JOINING ROOM', room)
    socket.join(room)
    socket.room = room

    // console.log('JOINED ROOM', socket.adapter.rooms)

    let added = false

    if (disconectedUsernames.includes(name)) {
      added = players.reconnectPlayer(socket.id, name)

      if (!added) {
        socket.emit('INVALID_SIGN_UP')
        socket.leave(room)
        socket.room = ''
        return
      }

      const cards = players.getHand(socket.id)
      socket.emit('DRAW_FULL_HAND', cards)
      socket.emit('NEW_ROUND')

      const updatedUsernames = disconectedUsernames.filter(username => username !== name)
      disconectedUsernames = updatedUsernames
    } else {
      added = players.addPlayer(socket.id, name)

      if (!added) {
        socket.emit('INVALID_SIGN_UP')
        socket.leave(room)
        socket.room = ''
        return
      }
      const cards = deck.drawWhiteCards(7)
      players.drawFullHand(socket.id, cards)
      socket.emit('DRAW_FULL_HAND', cards)


    }

    io.to(roomName).emit('PLAYERS', players.players)
    io.to(roomName).emit('DRAW_BLACK_CARD', blackCard)
    io.to(roomName).emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
    io.to(roomName).emit('BLACK_DECK_COUNT', deck.blackDeck.length)
    io.to(roomName).emit('WHITE_DECK_COUNT', deck.whiteDeck.length)

    const currentPlayer = players.players.find(player => player.id === socket.id)
    socket.username = currentPlayer.name
  })

  socket.on('DRAW_BLACK_CARD', () => {
    blackCard = deck.drawBlackCard()
    io.to(roomName).emit('DRAW_BLACK_CARD', blackCard)
    io.to(roomName).emit('BLACK_DECK_COUNT', deck.blackDeck.length)
  })

  socket.on('DRAW_FULL_HAND', () => {
    const cards = deck.drawWhiteCards(7)
    players.drawFullHand(socket.id, cards)
    socket.emit('DRAW_FULL_HAND', cards)
    io.to(roomName).emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('CHOOSE_WHITE_CARD', (card) => {
    cardWithID = { card, id: socket.id }
    chosenWhiteCards.push(cardWithID)
    io.to(roomName).emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)

    const [newCard] = deck.drawWhiteCards(1)
    const hand = players.drawOneCard(socket.id, card, newCard)
    socket.emit('DRAW_ONE_CARD', hand)
    io.to(roomName).emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('CHOOSE_WINNING_CARD', (card) => {
    parsedCard = JSON.parse(card)
    players.increaseScore(parsedCard.id)
    io.to(roomName).emit('PLAYERS', players.players)
    io.to(roomName).emit('WINNING_CARD', parsedCard.card)
  })

  socket.on('START_NEW_ROUND', () => {
    players.changeCzar()
    chosenWhiteCards = []
    io.to(roomName).emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
    blackCard = deck.drawBlackCard()
    io.to(roomName).emit('DRAW_BLACK_CARD', blackCard)
    io.to(roomName).emit('BLACK_DECK_COUNT', deck.blackDeck.length)
    io.to(roomName).emit('WINNING_CARD', '')
    io.to(roomName).emit('PLAYERS', players.players)
    io.to(roomName).emit('NEW_ROUND')
  })

  socket.on('SHUFFLE_WHITE_DECK', () => {
    deck.shuffleWhiteDeck()
    io.to(roomName).emit('WHITE_DECK_COUNT', deck.whiteDeck.length)
  })

  socket.on('SHUFFLE_BLACK_DECK', () => {
    deck.shuffleBlackDeck()
    io.to(roomName).emit('BLACK_DECK_COUNT', deck.blackDeck.length)
    blackCard = 'Czar...can you draw a card sometime today?'
    io.to(roomName).emit('DRAW_BLACK_CARD', blackCard)
  })

  socket.on('BOOT_OUT', (username) => {
    const currentCzar = players.players.find(player => player.czar)
    if (currentCzar.name === username) players.changeCzar()

    players.removePlayer(username)
    io.to(roomName).emit('PLAYERS', players.players)
  })

  socket.on('RESTART_GAME', () => {
    blackCard = 'Czar! hurry and draw a card already.'
    io.to(roomName).emit('DRAW_BLACK_CARD', blackCard)

    chosenWhiteCards = []
    io.to(roomName).emit('CHOSEN_WHITE_CARDS', chosenWhiteCards)
    io.to(roomName).emit('WINNING_CARD', '')
    io.to(roomName).emit('NEW_ROUND')

    players.restartGame()
    players.changeCzar()
    io.to(roomName).emit('PLAYERS', players.players)
  })
})

nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  app.post('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})