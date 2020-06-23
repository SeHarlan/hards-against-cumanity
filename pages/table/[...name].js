import { getPathNames, getCards } from '../../services/JsonAH'
import GameTable from '../game-table'

import { tableName } from '../index'

export default GameTable

export async function getStaticPaths() {
  const paths = getPathNames(tableName)
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const pickOneBool = (params.name[1] === 'pick-two') ? false : true

  const cards = getCards(pickOneBool)
  return {
    props: {
      cards
    }
  }
}
