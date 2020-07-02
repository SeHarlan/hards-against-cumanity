import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'
import styles from '../styles/WhiteCardHand.module.css'
import utilStyles from '../styles/utils.module.css'


export default function WhiteCardHand({ hand, setHand }) {
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
    const newHand = hand.filter(card => card !== chosenCard)
    setHand(newHand)
    setSubmitted(true)
    socket.emit('CHOOSE_WHITE_CARD', chosenCard)
  }

  const options = hand.map(card => (
    <div key={card}>
      <input type="radio" name="whiteCard" id={card} value={card} onChange={handleChange} />
      <label htmlFor={card}>
        <WhiteCard text={card} />
      </label>
      <br />
    </div>
  ))

  return (
    <form>
      <fieldset disabled={currentPlayer?.czar || submitted}>
        <legend>Your Cards ({currentPlayer?.name})</legend>
        {options}
        <button disabled={!chosenCard} onClick={handleClick}>Final Answer</button>
      </fieldset>
    </form >
  )

}