import GameTable from './game-table'

export default GameTable

export async function getStaticPaths() {
  const res = await fetch(`${process.env.URL_BASE}api/pathnames`)
  const pathnames = await res.json()
  const paths = pathnames.map(name => ({ params: { name } }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      paramsName: params.name
    }
  }
}
