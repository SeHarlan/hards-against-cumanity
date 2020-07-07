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

  const hideCards = (chosenCards.length !== players.length - 1)

  const options = chosenCards.map(card => (
    <div key={card.id}>
      <input className={styles.radio} type="radio" name="chosenCard" id={card.id} value={JSON.stringify(card)} onChange={handleChange} />
      <label htmlFor={card.id}>
        <WhiteCard notActive={!currentPlayer?.czar || submitted} text={card.card} blank={hideCards} />
      </label>
      <br />
    </div>
  ))

  const buttonDisabled = (!chosenCard || !currentPlayer?.czar || !chosenCards.length || submitted || hideCards)

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