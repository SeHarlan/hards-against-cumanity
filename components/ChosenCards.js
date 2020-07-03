import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'
import styles from '../styles/WhiteCardHand.module.css'
import utilStyles from '../styles/utils.module.css'


export default function ChosenCards({ chosenCards }) {
  const [chosenCard, setChosenCard] = useState('')
  const [players, setPlayers] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const socket = useSocket()
  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('NEW_ROUND', () => {
    setSubmitted(false)
    setChosenCard('')
  })

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()
    setSubmitted(true)
    socket.emit('CHOOSE_WINNING_CARD', chosenCard)
  }

  const handleNewRound = () => socket.emit('START_NEW_ROUND')

  const options = chosenCards.map(card => (
    <div key={card.id}>
      <input className={styles.radio} type="radio" name="chosenCard" id={card.id} value={JSON.stringify(card)} onChange={handleChange} />
      <label htmlFor={card.id}>
        <WhiteCard notActive={!currentPlayer?.czar || submitted} text={card.card} />
      </label>
      <br />
    </div>
  ))

  const buttonDisabled = (!chosenCard || !currentPlayer?.czar || !chosenCards.length || submitted)

  return (
    <>
      {currentPlayer?.czar &&
        <div>
          <h3>You are the Card Czar</h3>
          <button disabled={!submitted} onClick={handleNewRound}>Start New Round</button>
        </div>
      }
      <form className={styles.handContainer}>
        <legend>Chosen Cards</legend>
        <section className={styles.hand}>
          {options}
        </section>
        <button className={`${utilStyles.button} ${utilStyles.black} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleClick}>This Is The One</button>
      </form>
    </>
  )

}