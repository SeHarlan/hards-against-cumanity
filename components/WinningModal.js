import useSocket from "../lib/useSocket"
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/WinningModal.module.css'
import Confetti from 'react-confetti'

export default function WinningModal({ winnerName, winner }) {
  const socket = useSocket()

  const handleRestart = () => { socket.emit('RESTART_GAME') }

  return (<div className={styles.modal}>
    {winner && <Confetti />}
    <section className={styles.section}>
      <h4>{winnerName} has won.</h4>

      {winner
        ? <h1>You Did It, You F@#king Did It!</h1>
        : <h1>You... are a Loser.</h1>
      }

      <button className={`${utilStyles.button} ${utilStyles.white}`} onClick={handleRestart}>Restart Game</button>
    </section>
  </div>)
}