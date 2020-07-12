import Layout from '../components/Layout';
import { BlackCard, WhiteCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import { useState, useEffect } from 'react';
import ChosenCards from '../components/ChosenCards';
import useSocket from '../lib/useSocket';
import withList from '../lib/withList'
import Player from '../components/Player';
import styles from '../styles/GameTable.module.css'
import utilStyles from '../styles/utils.module.css'
import DangerZone from '../components/DangerZone';
import WinningModal from '../components/WinningModal';

const Players = withList(Player)

const winningScore = 7

export default function GameTable({ paramsName }) {
  const [chosenCards, setChosenCards] = useState([])
  const [blackCard, setBlackCard] = useState('Not Connected yet')
  const [whiteHand, setWhiteHand] = useState([])
  const [blackDeckCount, setBlackDeckCount] = useState('')
  const [nameText, setNameText] = useState('')
  const [players, setPlayers] = useState([])
  const [invalid, setInvalid] = useState(false)
  const [winningCard, setWinningCard] = useState('')
  const [winner, setWinner] = useState(null)
  const [cardCzar, setCardCzar] = useState('Nobody')

  const socket = useSocket()

  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('CHOSEN_WHITE_CARDS', (cards) => setChosenCards(cards))
  useSocket('WINNING_CARD', (card) => setWinningCard(card))

  useSocket('DRAW_BLACK_CARD', (card) => setBlackCard(card))
  useSocket('DRAW_FULL_HAND', (hand) => setWhiteHand(hand))
  useSocket('DRAW_ONE_CARD', (hand) => setWhiteHand(hand))

  useSocket('BLACK_DECK_COUNT', (count) => setBlackDeckCount(count))

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('NEW_ROUND', () => {
    setChosenCards([])
    setWinner(null)
  })

  useSocket('INVALID_SIGN_UP', () => setInvalid(true))

  useEffect(() => {
    players.forEach(player => {
      if (player.score >= winningScore) setWinner(player.name)
      if (player.czar) setCardCzar(player.name)
    })
  }, [players])


  const handleDrawBlackCard = () => socket.emit('DRAW_BLACK_CARD')

  const handleNewRound = () => socket.emit('START_NEW_ROUND')

  const handleJoinGame = (e) => {
    e.preventDefault()

    const roomName = paramsName || 'community'
    socket.emit('JOIN_GAME', nameText, roomName)
  }

  const buttonDisabled = (!currentPlayer?.czar || chosenCards.length)

  const cardCzarMessage = currentPlayer?.czar ? "You are the Card Czar!" : `${cardCzar} is the Card Czar.`

  return (
    <Layout>
      <section>
        <h1 className={styles.czar}>{paramsName || 'Community Game Table'}</h1>
        <em className={utilStyles.cardsRemaining}>{process.env.NEXT_PUBLIC_URL_BASE}{paramsName || 'community'}</em>


        {!currentPlayer && (<>
          <form className={utilStyles.buttonContainer} onSubmit={handleJoinGame}>
            <div />
            <input
              className={utilStyles.input}
              type="text"
              value={nameText}
              onChange={({ target }) => setNameText(target.value)}
              placeholder="Your Name"
            />
            <button className={`${utilStyles.button} ${utilStyles.white}`} > Join Game</button>
          </form>
          {invalid && <p className={utilStyles.cardsRemaining}>Username already taken</p>}
        </>)
        }

        <Players className={`${utilStyles.list} ${styles.players}`} list={players} />

        <ChosenCards chosenCards={chosenCards} />

        <h3 className={styles.czar}>{cardCzarMessage}</h3>

        <section className={styles.cardDisplayContainer}>
          <div>
            <BlackCard text={blackCard} />
            <em className={utilStyles.cardsRemaining}>~ {blackDeckCount} remaining ~</em>
          </div>

          {winningCard && (<>
            <button className={`${utilStyles.button} ${utilStyles.white} ${!currentPlayer?.czar && utilStyles.noDisplay} ${utilStyles.newRoundButtonLargeScreen}`} onClick={handleNewRound}>Start New Round</button>

            <div>
              <WhiteCard notActive={true} text={winningCard} />
              <em className={utilStyles.cardsRemaining} >~ Winning Card ~</em>
            </div>

          </>)}

        </section>

        <button className={`${utilStyles.button} ${utilStyles.white} ${!currentPlayer?.czar && utilStyles.noDisplay} ${utilStyles.newRoundButtonSmallScreen} ${!winningCard && utilStyles.buttonDisabled}`} disabled={!winningCard} onClick={handleNewRound}>Start New Round</button>

        <button className={`${utilStyles.button} ${utilStyles.white} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleDrawBlackCard}>Draw New Black Card</button>

        <hr className={utilStyles.line} />

        <WhiteCardHand hand={whiteHand} setHand={setWhiteHand} />

        {currentPlayer && <DangerZone />}

        {winner && <WinningModal winnerName={winner} winner={currentPlayer?.name === winner} />}

      </section>
    </Layout>
  )
}

