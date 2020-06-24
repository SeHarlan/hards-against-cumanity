import { WhiteCard } from './Cards'
import { useState } from 'react'


export default function ChosenCards({ chosenCards }) {
  const [chosenCard, setChosenCard] = useState('')

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleClick = (e) => {
    e.preventDefault()

    //logic for choosing the winning card
    alert(chosenCard)
  }

  const options = chosenCards.map(card => (
    <div key={card}>
      <input type="radio" name="chosenCard" id={card} value={card} onChange={handleChange} />
      <label htmlFor={card}>
        <WhiteCard text={card} />
      </label>
      <br />
    </div>
  ))

  return (
    <>
      <h3>You are the Card Czar</h3>
      <form>
        {options}
        <button onClick={handleClick}>This Is The One</button>
      </form>
    </>
  )

}