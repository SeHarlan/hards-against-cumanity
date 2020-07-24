class Players {
  constructor() {
    this.players = []
    this.playerCount = 0
  }

  addPlayer(id, name) {
    if (this.players.some(player => player.id === id)) return false
    if (this.players.some(player => player.name === name)) return false

    this.playerCount++

    const playerNumber = this.playerCount
    const playerName = name || `Player ${playerNumber}`

    this.players.push({
      id,
      player: playerNumber,
      name: playerName,
      score: 0,
      czar: (playerNumber === 1) ? true : false,
      hand: []
    })
    return true
  }

  removePlayer(name) {
    const playerIndex = this.players.findIndex(player => player.name === name)
    if (playerIndex === -1) return false

    this.players.splice(playerIndex, 1)
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
    if (winner) winner.score++
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

  restartGame() {
    this.players.forEach(player => {
      player.score = 0;
    })
  }
}

module.exports = Players