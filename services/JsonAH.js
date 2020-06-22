import jsonAH from '../data/JsonAH.json'

export function getCards(onlyPickOne = true) {
  const whiteCards = jsonAH.whiteCards
  const allBlackCards = jsonAH.blackCards

  const pickOneBlackCards = allBlackCards.filter(card => card.pick === 1)

  if (onlyPickOne) return { whiteCards, pickOneBlackCards}
  else return { whiteCards, allBlackCards}
}