import Layout from '../components/Layout';
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import { useState } from 'react';
import ChosenCards from '../components/ChosenCards';
import useSocket from '../lib/useSocket';

export default function GameTable() {

  const [chosenCards, setChosenCards] = useState([])
  const [blackCard, setBlackCard] = useState('Black Card')
  const [whiteHand, setWhiteHand] = useState([])
  const [blackDeckCount, setBlackDeckCount] = useState('')
  const [whiteDeckCount, setWhiteDeckCount] = useState('')

  const socket = useSocket()

  useSocket('CHOSEN_WHITE_CARDS', (card) => setChosenCards([...chosenCards, card]))

  useSocket('DRAW_BLACK_CARD', (card) => setBlackCard(card))
  useSocket('DRAW_FULL_HAND', (hand) => setWhiteHand(hand))

  useSocket('BLACK_DECK_COUNT', (count) => setBlackDeckCount(count))
  useSocket('WHITE_DECK_COUNT', (count) => setWhiteDeckCount(count))


  const handleDrawBlackCard = () => socket.emit('DRAW_BLACK_CARD')
  const handleDrawFullHand = () => socket.emit('DRAW_FULL_HAND')

  return (
    <Layout>
      <section>
        <p>black deck count: {blackDeckCount}</p>
        <p>white deck count: {whiteDeckCount}</p>
        <button onClick={handleDrawBlackCard}>Draw Black Card</button>
        <button onClick={handleDrawFullHand}>Draw Full Hand</button>
        <BlackCard text={blackCard} />
        <ChosenCards chosenCards={chosenCards} />
        <WhiteCardHand hand={whiteHand} />
      </section>
    </Layout>
  )
}

