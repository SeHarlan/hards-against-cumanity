import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'
import styles from '../styles/WhiteCardHand.module.css'
import utilStyles from '../styles/utils.module.css'

export default function WhiteCardHand({ hand, setHand }) {
  const [chosenCard, setChosenCard] = useState('')
  const [players, setPlayers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [whiteDeckCount, setWhiteDeckCount] = useState('')

  const socket = useSocket()
  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('WHITE_DECK_COUNT', (count) => setWhiteDeckCount(count))
  useSocket('NEW_ROUND', () => {
    setSubmitted(false)
    setChosenCard('')
  })
  const handleDrawFullHand = () => socket.emit('DRAW_FULL_HAND')

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()
    const newHand = hand.filter(card => card !== chosenCard)
    setHand(newHand)
    setSubmitted(true)
    socket.emit('CHOOSE_WHITE_CARD', chosenCard)
  }

  const options = hand.map(card => (
    <div key={card}>
      <input className={styles.radio} type="radio" name="whiteCard" id={card} value={card} onChange={handleChange} />
      <label htmlFor={card}>
        <WhiteCard notActive={currentPlayer?.czar || submitted || !currentPlayer} text={card} />
      </label>
      <br />
    </div>
  ))

  const buttonDisabled = (!chosenCard || currentPlayer?.czar || submitted || !currentPlayer)

  return (<>
    <p className={styles.label}>Your Cards ({currentPlayer?.name})</p>
    <form className={styles.hand}>
      {options}
    </form>

    <div className={utilStyles.buttonContainer}>
      <div></div>
      <button className={`${utilStyles.button} ${utilStyles.black} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleClick}>Final Answer</button>
      <button disabled={!currentPlayer} className={`${utilStyles.button} ${utilStyles.white} ${!currentPlayer && utilStyles.buttonDisabled}`} onClick={handleDrawFullHand}>Draw Full Hand</button>
      <div></div>
    </div>

    <em className={utilStyles.cardsRemaining}>~ {whiteDeckCount} white cards remaining ~</em>
  </>)

}