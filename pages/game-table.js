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
        <p>black deck count: {blackDeckCount}</p>
        <p>white deck count: {whiteDeckCount}</p>
        {!currentPlayer &&
          <form onSubmit={handleJoinGame}>
            <input type="text" value={nameText} onChange={handleNameText} />
            <button>Join Game</button>
          </form>
        }
        <button onClick={handleDrawBlackCard}>Draw Black Card</button>
        <button onClick={handleDrawFullHand}>Draw Full Hand</button>
        <BlackCard text={blackCard} />
        <ChosenCards chosenCards={chosenCards} />
        <WhiteCardHand hand={whiteHand} setHand={setWhiteHand} />
      </section>
    </Layout>
  )
}

