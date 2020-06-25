import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'


export default function WhiteCardHand({ hand }) {
  const [chosenCard, setChosenCard] = useState('')
  const socket = useSocket()

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()
    socket.emit('CHOSE_WHITE_CARD', chosenCard)
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
      {options}
      <button onClick={handleClick}>Final Answer</button>
    </form>
  )

}