import GameTable from './game-table'

export default GameTable

export async function getStaticPaths() {
  let paths = null
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE}api/pathnames`)
    const pathnames = await res.json()
    paths = pathnames.map(name => ({ params: { name } }))

  } catch (error) {
    console.log(error)
  }

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
