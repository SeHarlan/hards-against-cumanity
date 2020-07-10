import useSocket from "../lib/useSocket"
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Modal.module.css'
import Confetti from 'react-confetti'

export default function WinningModal({ winnerName, winner }) {
  const socket = useSocket()

  const handleRestart = () => { socket.emit('RESTART_GAME') }

  if (winner) return (<div className={styles.modal}>
    {winner && <Confetti />}
    <section className={styles.section}>
      <h1>You Did It, You F@#king Did It!</h1>
      <button
        className={`${utilStyles.button} ${utilStyles.white}`}
        onClick={handleRestart}>
        Restart Game
      </button>
    </section>
  </div>)

  return (<div className={styles.modal}>
    {winner && <Confetti />}
    <section className={styles.section}>
      <h4>{winnerName} has won.</h4>
      <h1>You? Well you are a loser.</h1>
      <em>Waiting the "winner" to restart the game...</em>
    </section>
  </div>)
}