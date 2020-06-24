import { useState, useEffect } from 'react'

//Durstenfeld shuffle
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = deck[i]
    deck[i] = deck[randomIndex]
    deck[randomIndex] = temp
  }
  return deck
}

export default function useDeck(cards) {
  const [whiteDeck, setWhiteDeck] = useState([])
  const [blackDeck, setBlackDeck] = useState([])

  useEffect(() => {
    setWhiteDeck(shuffleDeck(cards.whiteCards))
    setBlackDeck(shuffleDeck(cards.blackCards))
  }, [cards])

  const drawWhiteCards = (amount) => {
    // const whiteDeckCopy = [...whiteDeck]
    // const drawnWhiteCards = whiteDeckCopy.splice(0, amount)
    // setWhiteDeck((_) => whiteDeckCopy)

    const drawnWhiteCards = whiteDeck.splice(0, amount)
    return drawnWhiteCards
  }

  const drawBlackCard = () => {
    // const blackDeckCopy = [...blackDeck]
    // const drawnBlackCard = blackDeckCopy.shift()
    // setBlackDeck((_) => blackDeckCopy)

    const drawnBlackCard = blackDeck.shift()
    return drawnBlackCard
  }

  return {
    drawBlackCard,
    drawWhiteCards,
  }
}