class Players {
  constructor() {
    this.players = {}
    this.playersNames = []
    // this.players = []
    this.playerCount = 0
  }

  addPlayer(id, name) {
    if (this.players[name]) return false
    let alreadyAnId;
    this.playersNames.forEach(player => {
      if (this.players[player].id === id) alreadyAnId = true
    })

    if (alreadyAnId) return false

    // if (this.players.some(player => player.id === id)) return false
    // if (this.players.some(player => player.name === name)) return false

    this.playerCount++

    const playerNumber = this.playerCount
    const playerName = name || `Player ${playerNumber}`

    // this.players.push({
    this.playersNames.push(playerName)
    this.players[playerName] = {
      id,
      player: playerNumber,
      name: playerName,
      score: 0,
      czar: (playerNumber === 1) ? true : false,
      hand: [],
      status: 'Active'
    }
    return true
  }

  setSubmitted(name, bool) {
    this.players[name].submitted = bool
  }

  setDisconnected(name, bool) {
    this.players[name].disconnected = bool
  }



  removePlayer(name) {
    // const playerIndex = this.players.findIndex(player => player.name === name)
    // if (playerIndex === -1) return false

    // this.players.splice(playerIndex, 1)
    // return true

    const playerIndex = this.playersNames.findIndex(player => player === name)

    if (!this.players[name] || playerIndex === -1) return false

    this.playersNames.splice(playerIndex, 1)
    delete this.players[name]
    return true
  }

  reconnectPlayer(socketId, name) {
    // const player = this.players.find(player => player.name === name)
    // if (!player) return false

    // player.id = socketId
    // return true

    if (!this.players[name]) return false

    this.players[name].id = socketId
    return true
  }

  increaseScore(name) {
    // const winner = this.players.find(player => (player.id === id))
    // if (winner) winner.score++

    if (this.players[name]) this.players[name].score++
  }

  changeCzar() {
    // const currentCzarIndex = this.players.findIndex(player => player.czar)
    // const newCzarIndex = (currentCzarIndex + 1 === this.players.length)
    //   ? 0
    //   : currentCzarIndex + 1;

    // this.players[currentCzarIndex].czar = false
    // this.players[newCzarIndex].czar = true

    let currentCzarIndex;
    this.playersNames.forEach((player, i) => {
      if (this.players[player].czar) {
        currentCzarIndex = i
      }
    })
    const newCzarIndex = (currentCzarIndex + 1 === this.playersNames.length)
      ? 0
      : currentCzarIndex + 1;

    this.players[this.playersNames[currentCzarIndex]].czar = false
    this.players[this.playersNames[newCzarIndex]].czar = true
  }

  drawFullHand(name, cards) {
    // const player = this.players.find(player => (player.id === id))
    // player.hand = cards
    // return player.hand

    // const name = this.getName(id)

    this.players[name].hand = cards

    return cards
  }

  drawOneCard(name, prevCard, newCard) {
    // const player = this.players.find(player => (player.id === id))
    // const index = player.hand.indexOf(prevCard)
    // player.hand.splice(index, 1, newCard)
    // return player.hand

    // const name = this.getName(id)

    const prevIndex = this.players[name].hand.indexOf(prevCard)
    this.players[name].hand.splice(prevIndex, 1, newCard)

    return this.players[name].hand
  }

  getHand(name) {
    // const player = this.players.find(player => (player.id === id))
    // return player.hand
    return this.players[name].hand
  }

  getName(id) {
    // const player = this.players.find(player => (player.id === id))
    // return player.name

    let name;

    this.playersNames.forEach(player => {
      if (this.players[player].id === id) name = this.players[player].name
    })

    return name
  }

  getCurrentCzar() {
    let currentCzar;
    this.playersNames.forEach(player => {
      if (this.players[player].czar) currentCzar = this.players[player]
    })
    return currentCzar
  }

  // getPlayerById(id) {
  //   const name = this.getName(id)
  //   return this.players[name]
  // }

  // setStatusById(id, status) {
  //   const name = this.getName(id)
  //   this.players[name].status = status
  // }

  setAllStatusActive() {
    this.playersNames.forEach(player => {
      if (this.players[player].status !== 'Disconnected') {
        this.players[player].status = "Active"
      }
    })
  }

  restartGame() {
    // this.players.forEach(player => {
    //   player.score = 0;
    // })

    this.playersNames.forEach(player => {
      this.players[player].score = 0
    })
  }
}

module.exports = Players