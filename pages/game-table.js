import Layout from '../components/Layout';
import { getCards } from '../lib/services'
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import useDeck from '../lib/useDeck';
import { useState } from 'react';
import ChosenCards from '../components/ChosenCards';

export default function GameTable({ cards }) {

  const {
    drawBlackCard,
    drawWhiteCards
  } = useDeck(cards)

  const chosenCards = ['1', '2', '3']

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
