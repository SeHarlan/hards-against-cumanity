const Deck = require('./Deck')
const Players = require('./Players')
const { getCards } = require('./nodeServices')

class Room {
  constructor(name) {
    this.cards = getCards();
    this.deck = new Deck(getCards());
    this.players = new Players();
    this.disconectedUsernames = [];
    this.blackCard = 'Tell the Card Czar to draw a black card!';
    this.chosenWhiteCards = [];
    this.roomName = name;
  }
}

class Rooms {
  constructor() {
    this.community = new Room('community')
  }

  addRoom(name) {
    this[name] = new Room(name)
  }
}

module.exports = Rooms