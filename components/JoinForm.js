import { useState } from 'react';
import useSocket from '../lib/useSocket';

import utilStyles from '../styles/utils.module.css'

export default function JoinForm({ paramsName }) {
  const [invalid, setInvalid] = useState(false)
  const [nameText, setNameText] = useState('')

  const socket = useSocket()

  useSocket('INVALID_SIGN_UP', () => setInvalid(true))

  const handleJoinGame = (e) => {
    e.preventDefault()
    socket.emit('JOIN_GAME', nameText, paramsName)
  }
  return (<>
    <form className={utilStyles.buttonContainer} onSubmit={handleJoinGame}>
      <div />
      <input
        className={utilStyles.input}
        type="text"
        value={nameText}
        onChange={({ target }) => setNameText(target.value)}
        placeholder="Your Name"
      />
      <button className={`${utilStyles.button} ${utilStyles.black}`} > Join Game</button>
    </form>
    {invalid && <p className={utilStyles.cardsRemaining}>Username already taken</p>}
  </>)
}


