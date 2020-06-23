import Layout from '../components/Layout';
import { getCards } from '../lib/services'
import { useState, useEffect } from 'react';
import Deck from '../lib/Deck';
import withList from '../lib/withList';
import { BlackCard, WhiteCard } from '../components/Cards';


export default function GameTable({ cards }) {

  const deck = new Deck(cards)

  const WhiteCardHand = withList(WhiteCard)

  return (
    <Layout>
      <section>
        <BlackCard text={deck.drawBlackCard()} />
        <WhiteCardHand list={deck.drawWhiteCards(7)} />
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