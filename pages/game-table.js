import Layout from '../components/Layout';
import { getCards } from '../lib/services'
import { useState, useEffect } from 'react';
import Deck from '../lib/Deck';
import withList from '../lib/withList';
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';

export default function GameTable({ cards }) {

  const deck = new Deck(cards)

  return (
    <Layout>
      <section>
        <BlackCard text={deck.drawBlackCard()} />
        <WhiteCardHand hand={deck.drawWhiteCards(7)} />
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
