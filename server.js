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
  socket.on('disconnect', () => disconnect(socket))

  socket.on('CREATE_ROOM', (room) => createRoom(socket, room))

  socket.on('JOIN_GAME', (name, room) => joinGame(socket, name, room))

  socket.on('DRAW_BLACK_CARD', () => drawBlackCard(socket))

  socket.on('DRAW_FULL_HAND', () => drawFullHand(socket))

  socket.on('CHOOSE_WHITE_CARD', (card) => chooseWhiteCard(socket, card))

  socket.on('CHOOSE_WINNING_CARD', (card) => chooseWinningCard(socket, card))

  socket.on('SHUFFLE_WHITE_DECK', () => shuffleWhiteDeck(socket))

  socket.on('SHUFFLE_BLACK_DECK', () => shuffleBlackDeck(socket))

  socket.on('BOOT_OUT', (username) => bootOut(socket, username))

  socket.on('RESTART_GAME', () => restartGame(socket))

  socket.on('START_NEW_ROUND', () => startNewRound(socket))
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

function startNewRound(socket) {
  try {
    rooms[socket.room].players.changeCzar()
    rooms[socket.room].chosenWhiteCards = []
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    rooms[socket.room].blackCard = rooms[socket.room].deck.drawBlackCard()
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    io.to(socket.room).emit('WINNING_CARD', '')
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('NEW_ROUND')
  } catch (err) {
    console.log(err)
  }
}

function restartGame(socket) {
  try {
    rooms[socket.room].blackCard = 'Czar! Draw a card already. The people wanna play again!'
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    rooms[socket.room].chosenWhiteCards = []
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    io.to(socket.room).emit('WINNING_CARD', '')
    io.to(socket.room).emit('NEW_ROUND')
    rooms[socket.room].players.restartGame()
    rooms[socket.room].players.changeCzar()
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
  } catch (err) {
    console.log(err)
  }
}

function bootOut(socket, username) {
  try {
    const currentCzar = rooms[socket.room].players.getCurrentCzar()
    if (currentCzar.name === username) {
      rooms[socket.room].players.changeCzar()
    }
    const bootedUser = rooms[socket.room].players.players[username]
    const cardIndex = rooms[socket.room].chosenWhiteCards.findIndex(card => card.id === bootedUser.id)
    if (cardIndex !== -1)
      rooms[socket.room].chosenWhiteCards.splice(cardIndex, 1)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    rooms[socket.room].players.removePlayer(username)
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
  } catch (err) {
    console.log(err)
  }
}

function shuffleBlackDeck(socket) {
  try {
    rooms[socket.room].deck.shuffleBlackDeck()
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    rooms[socket.room].blackCard = 'Czar...can you draw a card sometime today?'
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
  } catch (err) {
    console.log(err)
  }
}

function shuffleWhiteDeck(socket) {
  try {
    rooms[socket.room].deck.shuffleWhiteDeck()
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  } catch (err) {
    console.log(err)
  }
}

function chooseWinningCard(socket, card) {
  try {
    parsedCard = JSON.parse(card)
    const name = rooms[socket.room].players.getName(parsedCard.id)
    rooms[socket.room].players.increaseScore(name)
    rooms[socket.room].players.setAllStatusActive()
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('WINNING_CARD', { card: parsedCard.card, name })
  } catch (err) {
    console.log(err)
  }
}

function chooseWhiteCard(socket, card) {
  try {
    cardWithID = { card, id: socket.id }
    rooms[socket.room].chosenWhiteCards.push(cardWithID)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    rooms[socket.room].players.players[socket.username].status = "Submitted"
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    const [newCard] = rooms[socket.room].deck.drawWhiteCards(1)
    const hand = rooms[socket.room].players.drawOneCard(socket.username, card, newCard)
    socket.emit('DRAW_ONE_CARD', hand)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  } catch (err) {
    console.log(err)
  }
}

function drawFullHand(socket) {
  console.log(socket.username)
  try {
    const cards = rooms[socket.room].deck.drawWhiteCards(7)
    rooms[socket.room].players.drawFullHand(socket.username, cards)
    socket.emit('DRAW_FULL_HAND', cards)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)
  } catch (err) {
    console.log(err)
  }
}

function drawBlackCard(socket) {
  try {
    rooms[socket.room].blackCard = rooms[socket.room].deck.drawBlackCard()
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
  } catch (err) {
    console.log(err)
  }
}

function invalidSignUp(socket, room) {
  socket.emit('INVALID_SIGN_UP')
  socket.leave(room)
  socket.room = null
  socket.username = null
}

function joinGame(socket, name, room) {
  try {
    socket.join(room)
    socket.room = room


    console.log('Joined Room: ', socket.room)
    let added = false
    if (rooms[socket.room].disconectedUsernames.includes(name)) {
      added = rooms[socket.room].players.reconnectPlayer(socket.id, name)
      if (!added) {
        invalidSignUp(socket, room)
        return
      }
      const cards = rooms[socket.room].players.getHand(name)
      socket.emit('DRAW_FULL_HAND', cards)
      socket.emit('NEW_ROUND')
      const updatedUsernames = rooms[socket.room].disconectedUsernames.filter(username => username !== name)
      rooms[socket.room].players.players[name].status = "Active"
      rooms[socket.room].disconectedUsernames = updatedUsernames
      socket.username = name
    }
    else {
      added = rooms[socket.room].players.addPlayer(socket.id, name)
      if (!added) {
        invalidSignUp(socket, room)
        return
      }
      const username = rooms[socket.room].players.getName(socket.id)
      const cards = rooms[socket.room].deck.drawWhiteCards(7)
      rooms[socket.room].players.drawFullHand(username, cards)
      socket.emit('DRAW_FULL_HAND', cards)
      socket.username = username
    }
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)
    io.to(socket.room).emit('DRAW_BLACK_CARD', rooms[socket.room].blackCard)
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    io.to(socket.room).emit('BLACK_DECK_COUNT', rooms[socket.room].deck.blackDeck.length)
    io.to(socket.room).emit('WHITE_DECK_COUNT', rooms[socket.room].deck.whiteDeck.length)

  } catch (err) {
    console.log(err)
  }
}

function createRoom(socket, room) {
  try {
    if (rooms[room]) {
      socket.emit('INVALID_SIGN_UP')
      return
    }
    socket.join(room)
    socket.room = room
    rooms.addRoom(room)
    console.log('Creacted Socket Room: ', socket.room)
  } catch (err) {
    console.log(err)
  }
}

function disconnect(socket) {
  try {
    if (!socket.room) return
    rooms[socket.room].disconectedUsernames.push(socket.username)
    rooms[socket.room].players.players[socket.username].status = "Disconnected"
    io.to(socket.room).emit('PLAYERS', rooms[socket.room].players.players)

    const cardIndex = rooms[socket.room].chosenWhiteCards.findIndex(card => card.id === socket.id)
    if (cardIndex !== -1) {
      rooms[socket.room].chosenWhiteCards.splice(cardIndex, 1)
    }
    io.to(socket.room).emit('CHOSEN_WHITE_CARDS', rooms[socket.room].chosenWhiteCards)
    socket.leave(socket.room)
    socket.username = null
    socket.room = null
  } catch (err) {
    console.log(err)
  }
}


