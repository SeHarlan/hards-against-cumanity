import { getPathNames } from '../../lib/nextServices'
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

  return {
    props: {

    }
  }
}
