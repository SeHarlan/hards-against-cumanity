import jsonAH from '../data/JsonAH.json'

export function getCards(onlyPickOne = true) {
  const whiteCards = jsonAH.whiteCards

  const allBlackCards = jsonAH.blackCards
  const pickOneBlackCards = allBlackCards.filter(card => card.pick === 1)

  const blackCardsData = onlyPickOne ? pickOneBlackCards : allBlackCards
  const blackCards = blackCardsData.map(card => card.text)

  return { whiteCards, blackCards }
}

export function getPathNames(customName) {
  return [
    {
      params: {
        name: customName
      }
    }
  ]
}