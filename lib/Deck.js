class Deck {
  constructor(cards) {
    this.whiteDeck = this.shuffleDeck([...cards.whiteCards])
    this.blackDeck = this.shuffleDeck([...cards.blackCards])
    this.cards = cards
  }

  //Durstenfeld shuffle
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const temp = deck[i]
      deck[i] = deck[randomIndex]
      deck[randomIndex] = temp
    }
    return deck
  }

  drawWhiteCards = (amount) => this.whiteDeck.splice(0, amount)

  drawBlackCard = () => this.blackDeck.shift()

  shuffleWhiteDeck = () => this.whiteDeck = this.shuffleDeck([...this.cards.whiteCards])
  shuffleBlackDeck = () => this.blackDeck = this.shuffleDeck([...this.cards.blackCards])
}

module.exports = Deck