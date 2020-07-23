const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const Rooms = require('./lib/Rooms')

const port = process.env.PORT || 3000

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const rooms = new Rooms()

io.on('connection', socket => {
  createRoom(socket)

  disconnect(socket)

  joinGame(socket)

  drawBlackCard(socket)

  drawFullHand(socket)

  chooseWhiteCard(socket)

  chooseWinningCard(socket)

  startNewRound(socket)

  shuffleWhiteDeck(socket)

  shuffleBlackDeck(socket)

  bootOut(socket)

  restartGame(socket)
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

function restartGame(socket) {
  socket.on('RESTART_GAME', () => {
    rooms[socket.room].blackCard = 'Czar! Draw a card already. The people wanna play again!'
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    rooms[socket.room].chosenWhiteCards = []
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    io.to(socket.room).emit('WINNING_CARD', '')
    io.to(socket.room).emit('NEW_ROUND')
    rooms[socket.room].players.restartGame()
    rooms[socket.room].players.changeCzar()
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
  })
}

function bootOut(socket) {
  socket.on('BOOT_OUT', (username) => {
    const currentCzar = rooms[socket.room].players.players.find(player => player.czar)
    if (currentCzar.name === username)
      rooms[socket.room].players.changeCzar()
    const bootedUser = rooms[socket.room].players.players.find(player => player.name === username)
    const cardIndex = rooms[socket.room].chosenWhiteCards.findIndex(card => card.id === bootedUser.id)
    if (cardIndex !== -1)
      rooms[socket.room].chosenWhiteCards.splice(cardIndex, 1)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    rooms[socket.room].players.removePlayer(username)
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
  })
}

function shuffleBlackDeck(socket) {
  socket.on('SHUFFLE_BLACK_DECK', () => {
    rooms[socket.room].deck.shuffleBlackDeck()
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    rooms[socket.room].blackCard = 'Czar...can you draw a card sometime today?'
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
  })
}

function shuffleWhiteDeck(socket) {
  socket.on('SHUFFLE_WHITE_DECK', () => {
    rooms[socket.room].deck.shuffleWhiteDeck()
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  })
}

function startNewRound(socket) {
  socket.on('START_NEW_ROUND', () => {
    rooms[socket.room].players.changeCzar()
    rooms[socket.room].chosenWhiteCards = []
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    rooms[socket.room].blackCard = rooms[socket.room].deck.drawBlackCard()
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    io.to(socket.room).emit('WINNING_CARD', '')
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('NEW_ROUND')
  })
}

function chooseWinningCard(socket) {
  socket.on('CHOOSE_WINNING_CARD', (card) => {
    parsedCard = JSON.parse(card)
    rooms[socket.room].players.increaseScore(parsedCard.id)
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('WINNING_CARD', parsedCard.card)
  })
}

function chooseWhiteCard(socket) {
  socket.on('CHOOSE_WHITE_CARD', (card) => {
    cardWithID = { card, id: socket.id }
    rooms[socket.room].chosenWhiteCards.push(cardWithID)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    const [newCard] = rooms[socket.room].deck.drawWhiteCards(1)
    const hand = rooms[socket.room].players.drawOneCard(socket.id, card, newCard)
    socket.emit('DRAW_ONE_CARD', hand)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  })
}

function drawFullHand(socket) {
  socket.on('DRAW_FULL_HAND', () => {
    const cards = rooms[socket.room].deck.drawWhiteCards(7)
    rooms[socket.room].players.drawFullHand(socket.id, cards)
    socket.emit('DRAW_FULL_HAND', cards)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  })
}

function drawBlackCard(socket) {
  socket.on('DRAW_BLACK_CARD', () => {
    rooms[socket.room].blackCard = rooms[socket.room].deck.drawBlackCard()
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
  })
}

function joinGame(socket) {
  socket.on('JOIN_GAME', (name, room) => {
    socket.join(room)
    socket.room = room
    console.log('Joined Room: ', socket.room)
    let added = false
    if (rooms[socket.room].disconectedUsernames.includes(name)) {
      added = rooms[socket.room].players.reconnectPlayer(socket.id, name)
      if (!added) {
        socket.emit('INVALID_SIGN_UP')
        socket.leave(room)
        socket.room = null
        return
      }
      const cards = rooms[socket.room].players.getHand(socket.id)
      socket.emit('DRAW_FULL_HAND', cards)
      socket.emit('NEW_ROUND')
      const updatedUsernames = rooms[socket.room].disconectedUsernames.filter(username => username !== name)
      rooms[socket.room].disconectedUsernames = updatedUsernames
    }
    else {
      added = rooms[socket.room].players.addPlayer(socket.id, name)
      if (!added) {
        socket.emit('INVALID_SIGN_UP')
        socket.leave(room)
        socket.room = null
        return
      }
      const cards = rooms[socket.room].deck.drawWhiteCards(7)
      rooms[socket.room].players.drawFullHand(socket.id, cards)
      socket.emit('DRAW_FULL_HAND', cards)
    }
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
    const currentPlayer = rooms[socket.room].players.players.find(player => player.id === socket.id)
    socket.username = currentPlayer.name
  })
}

function disconnect(socket) {
  socket.on('disconnect', () => {
    if (!socket.room)
      return
    rooms[socket.room].disconectedUsernames.push(socket.username)
    const index = rooms[socket.room].chosenWhiteCards.findIndex(card => card.id === socket.id)
    if (index !== -1)
      rooms[socket.room].chosenWhiteCards.splice(index, 1)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    socket.leave(socket.room)
    socket.room = null
  })
}

function createRoom(socket) {
  socket.on('CREATE_ROOM', (room) => {
    if (rooms[room]) {
      socket.emit('INVALID_SIGN_UP')
      return
    }
    socket.join(room)
    socket.room = room
    rooms.addRoom(room)
    console.log('Creacted Socket Room: ', socket.room)
  })
}
