import { getPathNames, getCards } from '../../lib/services'
import { useRouter } from 'next/router'
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

  const cards = getCards(false)
  return {
    props: {
      cards
    }
  }
}
