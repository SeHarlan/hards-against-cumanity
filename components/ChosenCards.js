import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'
import styles from '../styles/WhiteCardHand.module.css'
import utilStyles from '../styles/utils.module.css'
import { skipMessage } from '../components/SkipTurnModal'


export default function ChosenCards({ chosenCards, czarBool, players }) {
  const [chosenCard, setChosenCard] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const socket = useSocket()

  useSocket('NEW_ROUND', () => {
    setSubmitted(false)
    setChosenCard(null)
  })

  const handleClick = (e) => {
    e.preventDefault()
    setSubmitted(true)
    socket.emit('CHOOSE_WINNING_CARD', chosenCard)
  }
  const handleChange = ({ target }) => setChosenCard(target.value)

  const hideCards = (chosenCards.length !== players.length - 1)

  const buttonDisabled = (!chosenCard || !czarBool || !chosenCards.length || submitted || hideCards)

  let options = chosenCards
    .filter(card => card.card !== skipMessage)
    .map(card => (
      <div key={card.id}>
        <input className={styles.radio} type="radio" name="chosenCard" checked={chosenCard === JSON.stringify(card)} id={card.id} value={JSON.stringify(card)} onChange={handleChange} />
        <label htmlFor={card.id}>
          <WhiteCard notActive={!czarBool || submitted} text={card.card} blank={hideCards} />
        </label>
      </div>
    ))

  const skippingCard = {
    card: "Sadly all players have skipped this stupid card. No one gets the point. The Czar must choose this card to continue.",
    id: skipMessage
  }

  const allSkipped = (
    <div key={skippingCard.id}>
      <input className={styles.radio} type="radio" name="chosenCard" checked={chosenCard === JSON.stringify(skippingCard)} id={skippingCard.id} value={JSON.stringify(skippingCard)} onChange={handleChange} />
      <label htmlFor={skippingCard.id}>
        <WhiteCard
          notActive={false}
          text={skippingCard.card}
          blank={false} />
      </label>
    </div>
  )

  if (chosenCards.length && !options.length && !hideCards) options = allSkipped

  return (
    <>
      <p className={styles.label}>Chosen Cards</p>
      <form className={styles.hand}>
        {options}
      </form>
      <button className={`${utilStyles.button} ${utilStyles.black} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleClick}>This Is The One</button>
    </>
  )

}