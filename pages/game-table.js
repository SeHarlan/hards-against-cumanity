import Layout from '../components/Layout';
import { getCards } from '../lib/services'
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import useDeck from '../lib/useDeck';
import { useState } from 'react';
import ChosenCards from '../components/ChosenCards';
import useSocket from '../lib/useSocket';

export default function GameTable({ cards }) {

  const [chosenCards, setChosenCards] = useState([])
  const {
    drawBlackCard,
    drawWhiteCards
  } = useDeck(cards)

  useSocket('CHOSEN_WHITE_CARD', (card) => {
    setChosenCards([...chosenCards, card])
  })

  return (
    <Layout>
      <section>
        <BlackCard text={drawBlackCard()} />
        <ChosenCards chosenCards={chosenCards} />
        <WhiteCardHand hand={drawWhiteCards(7)} />
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cards = getCards()
  return {
    props: {
      cards
    }
  }
}
