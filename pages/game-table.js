import Layout from '../components/Layout';
import { getCards } from '../lib/services'
import { BlackCard } from '../components/Cards';
import WhiteCardHand from '../components/WhiteCardHand';
import useDeck from '../lib/useDeck';
import Deck from '../lib/Deck'



export default function GameTable({ cards }) {

  const {
    drawBlackCard,
    drawWhiteCards
  } = useDeck(cards)

  // used with Deck class
  // const deck = new Deck(cards)



  return (
    <Layout>
      <section>
        <BlackCard text={drawBlackCard()} />
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
