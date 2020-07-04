class Players {
  constructor() {
    this.players = []
  }

  addPlayer(id, name) {
    if (this.players.some(player => player.id === id)) return false
    if (this.players.some(player => player.name === name)) return false

    const playerNumber = this.players.length + 1

    this.players.push({
      id,
      player: playerNumber,
      name: name || `Player ${playerNumber}`,
      score: 0,
      czar: (playerNumber === 1) ? true : false,
      hand: []
    })
    return true
  }

  reconnectPlayer(socketId, name) {
    const player = this.players.find(player => player.name === name)

    if (!player) return false

    player.id = socketId
    return true
  }

  increaseScore(id) {
    const winner = this.players.find(player => (player.id === id))
    winner.score++
  }
  changeCzar() {
    const currentCzarIndex = this.players.findIndex(player => player.czar)
    const newCzarIndex = (currentCzarIndex + 1 === this.players.length)
      ? 0
      : currentCzarIndex + 1

    this.players[currentCzarIndex].czar = false
    this.players[newCzarIndex].czar = true
  }
  drawFullHand(id, cards) {
    const player = this.players.find(player => (player.id === id))
    player.hand = cards
    return player.hand
  }
  drawOneCard(id, prevCard, newCard) {
    const player = this.players.find(player => (player.id === id))
    const index = player.hand.indexOf(prevCard)
    player.hand.splice(index, 1, newCard)
    return player.hand
  }
  getHand(id) {
    const player = this.players.find(player => (player.id === id))
    return player.hand
  }
}

module.exports = Players