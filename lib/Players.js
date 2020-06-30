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
      czar: (playerNumber === 1) ? true : false
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

    console.log(currentCzarIndex, newCzarIndex)
    console.log(this.players)
  }
}

module.exports = Players