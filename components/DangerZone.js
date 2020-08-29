import { useState } from "react"
import utilStyles from '../styles/utils.module.css'
import useSocket from "../lib/useSocket"

export default function DangerZone({ overrideDisableBool, setOverrideDisableBool }) {
  const [checked, setChecked] = useState(false)
  const [nameText, setNameText] = useState('')

  const socket = useSocket()

  const handleBlackShuffle = () => {
    socket.emit('SHUFFLE_BLACK_DECK')
    setChecked(false)
  }
  const handleWhiteShuffle = () => {
    socket.emit('SHUFFLE_WHITE_DECK')
    setChecked(false)
  }
  const handleBootOut = (e) => {
    e.preventDefault()
    socket.emit('BOOT_OUT', nameText)
    setNameText('')
    setChecked(false)
  }

  const handleRestart = () => {
    socket.emit('RESTART_GAME')
    setChecked(false)
  }

  // const handleSkip = (playerName) =>

  const handleDangerZoneChange = () => {
    setOverrideDisableBool(false)
    setChecked(prev => !prev)
  }

  return (
    <section>
      <input id="danger" value={checked} checked={checked} type="checkbox" onChange={handleDangerZoneChange} />
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
        <input id="override" value={overrideDisableBool} type="checkbox" onChange={() => setOverrideDisableBool(prev => !prev)} />
        <label htmlFor="override">Override Button Disable</label>
        <button className={`${utilStyles.button} ${utilStyles.white}`} onClick={handleRestart}>Restart Game</button>
      </div>)}
    </section>
  )
}