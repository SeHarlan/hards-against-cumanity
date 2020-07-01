import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'


export default function ChosenCards({ chosenCards }) {
  const [chosenCard, setChosenCard] = useState('')
  const [players, setPlayers] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const socket = useSocket()
  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('PLAYERS', (players) => setPlayers(players))

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()
    socket.emit('CHOOSE_WINNING_CARD', chosenCard)
    setSubmitted(true)
  }

  const handleNewRound = () => socket.emit('START_NEW_ROUND')

  const options = chosenCards.map(card => (
    <div key={card.id}>
      <input type="radio" name="chosenCard" id={card.id} value={JSON.stringify(card)} onChange={handleChange} />
      <label htmlFor={card.id}>
        <WhiteCard text={card.card} />
      </label>
      <br />
    </div>
  ))

  return (
    <>
      {currentPlayer?.czar &&
        <div>
          <h3>You are the Card Czar</h3>
          <button disabled={!submitted} onClick={handleNewRound}>Start New Round</button>
        </div>
      }
      <form >
        <fieldset disabled={!currentPlayer?.czar || !chosenCards.length || submitted}>
          <legend>Chosen Cards</legend>
          {options}
          <button onClick={handleClick}>This Is The One</button>
        </fieldset>
      </form>
    </>
  )

}