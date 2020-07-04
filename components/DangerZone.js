import { useState } from "react"
import utilStyles from '../styles/utils.module.css'

export default function DangerZone() {
  const [checked, setChecked] = useState(false)
  const [nameText, setNameText] = useState('')

  const handleBootOut = (e) => {
    e.preventDefault()
  }

  return (
    <section>
      <input id="danger" type="checkbox" onChange={() => setChecked(prev => !prev)} />
      <label htmlFor="danger">Danger Zone</label>

      {checked && (<div>
        <button className={`${utilStyles.button} ${utilStyles.black}`}>Reshuffle Black Deck</button>
        <button className={`${utilStyles.button} ${utilStyles.white}`}> Reshuffle White Deck</button>
        <form className={utilStyles.buttonContainer} onSubmit={handleBootOut}>
          <div />
          <input
            className={utilStyles.input}
            type="text"
            value={nameText}
            onChange={({ target }) => setNameText(target.value)}
            placeholder="Player's Username" />
          <button className={`${utilStyles.button} ${utilStyles.black}`}>Give 'em the boot!</button>
        </form>
        <button className={`${utilStyles.button} ${utilStyles.white}`}>Restart Game</button>
      </div>)}
    </section>
  )
}