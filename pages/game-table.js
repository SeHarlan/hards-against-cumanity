import Layout from '../components/Layout';
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import { useState } from 'react';
import ChosenCards from '../components/ChosenCards';
import useSocket from '../lib/useSocket';
import withList from '../lib/withList'
import Player from '../components/Player';

const Players = withList(Player)

export default function GameTable() {

  const [chosenCards, setChosenCards] = useState([])
  const [blackCard, setBlackCard] = useState('Black Card')
  const [whiteHand, setWhiteHand] = useState([])
  const [blackDeckCount, setBlackDeckCount] = useState('')
  const [whiteDeckCount, setWhiteDeckCount] = useState('')
  const [nameText, setNameText] = useState('')
  const [players, setPlayers] = useState([])
  const [invalid, setInvalid] = useState(false)

  const socket = useSocket()

  const currentPlayer = players.find(player => player.id === socket.id)

  useSocket('CHOSEN_WHITE_CARDS', (card) => setChosenCards([...chosenCards, card]))

  useSocket('DRAW_BLACK_CARD', (card) => setBlackCard(card))
  useSocket('DRAW_FULL_HAND', (hand) => setWhiteHand(hand))
  useSocket('DRAW_ONE_CARD', (card) => {
    setWhiteHand(prev => [...prev, card[0]])
  })

  useSocket('BLACK_DECK_COUNT', (count) => setBlackDeckCount(count))
  useSocket('WHITE_DECK_COUNT', (count) => setWhiteDeckCount(count))

  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('NEW_ROUND', () => setChosenCards([]))

  useSocket('INVALID_SIGN_UP', () => setInvalid(true))


  const handleDrawBlackCard = () => socket.emit('DRAW_BLACK_CARD')
  const handleDrawFullHand = () => socket.emit('DRAW_FULL_HAND')
  const handleNameText = ({ target }) => setNameText(target.value)
  const handleJoinGame = (e) => {
    e.preventDefault()
    socket.emit('JOIN_GAME', nameText)
  }

  return (
    <Layout>
      <section>
        <Players list={players} />
        {!currentPlayer &&
          <form onSubmit={handleJoinGame}>
            <input type="text" value={nameText} onChange={handleNameText} />
            <button>Join Game</button>
            {invalid && <p>Username already taken</p>}
          </form>
        }
        <p>black deck count: {blackDeckCount}</p>
        <button onClick={handleDrawBlackCard}>Draw New Black Card</button>
        <BlackCard text={blackCard} />
        <ChosenCards chosenCards={chosenCards} />
        <WhiteCardHand hand={whiteHand} setHand={setWhiteHand} />
        <button onClick={handleDrawFullHand}>Draw Full Hand</button>
        <p>white deck count: {whiteDeckCount}</p>
      </section>
    </Layout>
  )
}

