const jsonAH = require('../data/JsonAH.json')

function getCards(onlyPickOne = true) {
  const whiteCards = jsonAH.whiteCards

  const allBlackCards = jsonAH.blackCards
  const pickOneBlackCards = allBlackCards.filter(card => card.pick === 1)

  const blackCardsData = onlyPickOne ? pickOneBlackCards : allBlackCards
  const blackCards = blackCardsData.map(card => card.text)

  return { whiteCards, blackCards }
}

module.exports = { getCards }