import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import { getCards } from '../services/JsonAH';

export default function GameTable({ cards }) {
  return (
    <Layout>
      <section>
        <h2>{cards.whiteCards[0]}</h2>
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