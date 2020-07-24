const Deck = require('./Deck')
const Players = require('./Players')
const { getCards } = require('./nodeServices')

class Rooms {
  constructor() {
    this.community = {
      cards: getCards(),
      deck: new Deck(getCards()),
      players: new Players(),
      disconectedUsernames: [],
      blackCard: 'Tell the Card Czar to draw a black card!',
      chosenWhiteCards: [],
      roomName: 'community',
    }
  }

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

module.exports = Rooms