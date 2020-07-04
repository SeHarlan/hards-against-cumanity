import { useState } from "react"
import utilStyles from '../styles/utils.module.css'
import useSocket from "../lib/useSocket"

export default function DangerZone() {
  const [checked, setChecked] = useState(false)
  const [nameText, setNameText] = useState('')

  const socket = useSocket()

  const handleBlackShuffle = () => { socket.emit('SHUFFLE_BLACK_DECK') }
  const handleWhiteShuffle = () => { socket.emit('SHUFFLE_WHITE_DECK') }

  const handleBootOut = (e) => {
    e.preventDefault()
    socket.emit('BOOT_OUT', nameText)
  }

  const handleRestart = () => { socket.emit('RESTART_GAME') }

  return (
    <section>
      <input id="danger" type="checkbox" onChange={() => setChecked(prev => !prev)} />
      <label htmlFor="danger">Danger Zone</label>

      {checked && (<div>
        <div className={utilStyles.buttonContainer}>
          <div />
          <button className={`${utilStyles.button} ${utilStyles.black}`} onClick={handleBlackShuffle}>Shuffle Black Deck</button>
          <button className={`${utilStyles.button} ${utilStyles.white}`} onClick={handleWhiteShuffle}>Shuffle White Deck</button>
        </div>
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
        <button className={`${utilStyles.button} ${utilStyles.white}`} onClick={handleRestart}>Restart Game</button>
      </div>)}
    </section>
  )
}