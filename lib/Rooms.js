const Deck = require('./Deck')
const Players = require('./Players')
const { getCards } = require('./nodeServices')

class Rooms {
  addRoom(name) {
    this[name] = {
      cards: getCards(),
      deck: new Deck(getCards()),
      players: new Players(),
      disconectedUsernames: [],
      blackCard: 'Tell the Card Czar to draw a black card!',
      chosenWhiteCards: [],
      roomName: name,
    }
  }
}

// const cards = getCards()
// let deck = new Deck(cards)
// const players = new Players()
// let disconectedUsernames = []
// let blackCard = 'Tell the Card Czar to draw a black card!'
// let chosenWhiteCards = []
// let roomName = 'GameTable'

module.exports = Rooms