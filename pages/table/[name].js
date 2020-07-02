import GameTable from '../game-table'

export default GameTable

export async function getStaticPaths(props) {
  console.log(props)
  const paths = [
    {
      params: {
        name: 'table 2'
      }
    }
  ]
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      name: params.name
    }
  }
}
