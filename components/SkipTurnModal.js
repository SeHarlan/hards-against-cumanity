import useSocket from "../lib/useSocket"
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/Modal.module.css'

export const skipMessage = 'Skipping Turn'

export default function SkipTurnModal({ open, setOpen, setSubmitted }) {
  if (!open) return <></>

  const socket = useSocket()

  const handleSkip = () => {
    setSubmitted(true)
    socket.emit('CHOOSE_WHITE_CARD', skipMessage)
    setOpen(false)
  }

  const handleGoBack = () => setOpen(false)

  return (<div className={styles.modal}>
    <section className={styles.section}>
      <h3>You haven't chosen anything. Do you want to...</h3>
      <button
        className={`${utilStyles.button} ${utilStyles.black}`}
        onClick={handleSkip}>
        Skip Turn
      </button>
      <button
        className={`${utilStyles.button} ${utilStyles.white}`}
        onClick={handleGoBack}>
        Go Back
      </button>
    </section>
  </div>)
}