import Layout from '../components/Layout';
import { BlackCard, WhiteCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import { useState } from 'react';
import ChosenCards from '../components/ChosenCards';
import useSocket from '../lib/useSocket';
import withList from '../lib/withList'
import Player from '../components/Player';
import styles from '../styles/GameTable.module.css'
import utilStyles from '../styles/utils.module.css'
import DangerZone from '../components/DangerZone';

const Players = withList(Player)

export default function GameTable() {

  const [chosenCards, setChosenCards] = useState([])
  const [blackCard, setBlackCard] = useState('Not Connected yet')
  const [whiteHand, setWhiteHand] = useState([])
  const [blackDeckCount, setBlackDeckCount] = useState('')
  const [nameText, setNameText] = useState('')
  const [players, setPlayers] = useState([])
  const [invalid, setInvalid] = useState(false)
  const [winningCard, setWinningCard] = useState('')

  const socket = useSocket()

  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('CHOSEN_WHITE_CARDS', (cards) => setChosenCards(cards))
  useSocket('WINNING_CARD', (card) => setWinningCard(card))

  useSocket('DRAW_BLACK_CARD', (card) => setBlackCard(card))
  useSocket('DRAW_FULL_HAND', (hand) => setWhiteHand(hand))
  useSocket('DRAW_ONE_CARD', (hand) => setWhiteHand(hand))

  useSocket('BLACK_DECK_COUNT', (count) => setBlackDeckCount(count))

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('NEW_ROUND', () => setChosenCards([]))

  useSocket('INVALID_SIGN_UP', () => setInvalid(true))


  const handleDrawBlackCard = () => socket.emit('DRAW_BLACK_CARD')

  const handleJoinGame = (e) => {
    e.preventDefault()
    socket.emit('JOIN_GAME', nameText)
  }

  const buttonDisabled = (!currentPlayer?.czar || chosenCards.length)

  return (
    <Layout>
      <section>

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

        <ChosenCards chosenCards={chosenCards} />

        <section className={styles.cardDisplayContainer}>
          <div>
            <BlackCard text={blackCard} />
            <em className={utilStyles.cardsRemaining}>~ {blackDeckCount} remaining ~</em>
          </div>
          {winningCard &&
            <div>
              <WhiteCard notActive={true} text={winningCard} />
              <em className={styles.cardsRemaining} >~ Winning Card ~</em>
            </div>
          }
        </section>

        <button className={`${utilStyles.button} ${utilStyles.white} ${buttonDisabled && utilStyles.buttonDisabled}`} disabled={buttonDisabled} onClick={handleDrawBlackCard}>Draw New Black Card</button>

        <hr className={utilStyles.line} />

        <WhiteCardHand hand={whiteHand} setHand={setWhiteHand} />

        <hr className={utilStyles.line} />

        <Players className={`${utilStyles.list} ${styles.players}`} list={players} />

        <DangerZone />

      </section>
    </Layout>
  )
}

