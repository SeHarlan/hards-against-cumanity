import { useState, useEffect } from "react"
import useSocket from "../lib/useSocket"

import { BlackCard, WhiteCard } from './Cards';

import styles from '../styles/BCArea.module.css'
import utilStyles from '../styles/utils.module.css'

export function BCArea({ cardCzarName, czarBool, chosenCardsBool }) {
  const [blackCard, setBlackCard] = useState('Not Connected yet')
  const [blackDeckCount, setBlackDeckCount] = useState('')
  const [winningCard, setWinningCard] = useState(null)
  const [counter, setCounter] = useState(10)

  const socket = useSocket()

  useSocket('DRAW_BLACK_CARD', (card) => setBlackCard(card))
  useSocket('BLACK_DECK_COUNT', (count) => setBlackDeckCount(count))
  useSocket('WINNING_CARD', (card) => setWinningCard(card)) // set dec counter!!!

  //!!!check winning card vs chosen cards bool and new round

  const handleDrawBlackCard = () => socket.emit('DRAW_BLACK_CARD')
  const handleNewRound = () => {
    socket.emit('START_NEW_ROUND')
    //stop dec counter!!!
    setCounter(10)
  }

  const buttonDisabled = (!czarBool || chosenCardsBool)

  const cardCzarMessage = czarBool ? "You are the Card Czar!" : `${cardCzarName} is the Card Czar.`

  useEffect(() => {
    if (counter <= 0) {
      handleNewRound()
    }
  }, [counter])

  const ButtonOrName = ({ largeScreen }) => {
    if (czarBool) return (<button
      className={`
        ${utilStyles.button} 
        ${utilStyles.white} 
        ${!czarBool && utilStyles.noDisplay}
        ${largeScreen
          ? utilStyles.newRoundButtonLargeScreen
          : utilStyles.newRoundButtonSmallScreen}
        ${!winningCard && utilStyles.buttonDisabled}`}
      disabled={!winningCard}
      onClick={handleNewRound}
    >Start New Round</button>
    )
    return (<>
      <em className={`
        ${styles.czar} 
        ${largeScreen
          ? utilStyles.newRoundButtonLargeScreen
          : utilStyles.newRoundButtonSmallScreen}`}
      >{winningCard?.name} has won the round!</em>
    </>)
  }

  return (<>
    <h3 className={styles.czar}>{cardCzarMessage}</h3>

    {winningCard && <p>New Round in {counter}</p>}

    <section className={styles.cardDisplayContainer}>
      <div>
        <BlackCard text={blackCard} />
        <em className={utilStyles.cardsRemaining}>~ {blackDeckCount} remaining ~</em>
      </div>

      {winningCard && (<>
        <ButtonOrName largeScreen />
        <div>
          <WhiteCard notActive={true} text={winningCard.card} />
          <em className={utilStyles.cardsRemaining} >~ Winning Card ~</em>
        </div>
      </>)}
    </section>

    <ButtonOrName />

    <button className={`${utilStyles.button} ${utilStyles.white} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleDrawBlackCard}>Draw New Black Card</button>
  </>)
}