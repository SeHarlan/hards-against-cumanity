import { WhiteCard } from './Cards'
import { useState } from 'react'
import useSocket from '../lib/useSocket'
import styles from '../styles/WhiteCardHand.module.css'
import utilStyles from '../styles/utils.module.css'
import SkipTurnModal from './SkipTurnModal'

export default function WhiteCardHand({ hand }) {
  const [chosenCard, setChosenCard] = useState(null)
  const [players, setPlayers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [whiteDeckCount, setWhiteDeckCount] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const socket = useSocket()

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('WHITE_DECK_COUNT', (count) => setWhiteDeckCount(count))
  useSocket('NEW_ROUND', () => {
    setSubmitted(false)
    setChosenCard(null)
  })

  const handleDrawFullHand = () => socket.emit('DRAW_FULL_HAND')

  const handleChange = ({ target }) => setChosenCard(target.value)

  const handleDeselect = ({ target }) => {
    if (target.value === chosenCard) setChosenCard(null);
  }
  const handleFinalAnswer = (e) => {
    e.preventDefault()
    if (!chosenCard) return setOpenModal(true)

    setSubmitted(true)
    socket.emit('CHOOSE_WHITE_CARD', chosenCard)
  }

  const currentPlayer = players.find(player => player.id === socket.id)

  const buttonDisabled = (currentPlayer?.czar || !currentPlayer || submitted)

  const options = hand.map(card => (
    <div key={card}>
      <input className={styles.radio} type="radio" name="whiteCard" checked={chosenCard === card} id={card} value={card} onChange={handleChange} onClick={handleDeselect} />
      <label htmlFor={card}>
        <WhiteCard notActive={buttonDisabled} text={card} />
      </label>
    </div>
  ))


  return (<>
    <p className={styles.label}>Your Cards ({currentPlayer?.name})</p>
    <form className={styles.hand}>
      {options}
    </form>

    <div className={utilStyles.buttonContainer}>
      <div></div>
      <button className={`${utilStyles.button} ${utilStyles.black} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleFinalAnswer}>Final Answer</button>
      <button disabled={!currentPlayer} className={`${utilStyles.button} ${utilStyles.white} ${!currentPlayer && utilStyles.buttonDisabled}`} onClick={handleDrawFullHand}>Draw Full Hand</button>
      <div></div>
    </div>

    <em className={utilStyles.cardsRemaining}>~ {whiteDeckCount} white cards remaining ~</em>
    <SkipTurnModal open={openModal} setOpen={setOpenModal} setSubmitted={setSubmitted} />
  </>)

}