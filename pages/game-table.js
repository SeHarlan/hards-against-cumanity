import Link from 'next/link';
import Layout from '../components/Layout';
import { getCards } from '../services/JsonAH';

export default function GameTable({ cards }) {
  return (
    <Layout>
      <section>
        <h2>{cards.blackCards[110]}</h2>
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