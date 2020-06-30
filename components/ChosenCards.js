import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'


export default function ChosenCards({ chosenCards }) {
  const [chosenCard, setChosenCard] = useState('')
  const [players, setPlayers] = useState([])

  const socket = useSocket()
  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('PLAYERS', (players) => setPlayers(players))

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()
    socket.emit('CHOOSE_WINNING_CARD', chosenCard)
  }

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
      {currentPlayer?.czar && <h3>You are the Card Czar</h3>}
      <form >
        <fieldset disabled={!currentPlayer?.czar || !chosenCards.length}>
          <legend>Chosen Cards</legend>
          {options}
          <button onClick={handleClick}>This Is The One</button>
        </fieldset>
      </form>
    </>
  )

}