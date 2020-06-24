import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSocket from '../lib/useSocket'

export const tableName = 'Pick Two'

export default function Home({ messages }) {

  const [socketConnection, setSocketConnection] = useState('')

  useSocket('CONNECTED', (data) => {
    setSocketConnection(data.message)
  })

  return (
    <Layout home>
      <section className={utilStyles.headingMd}>

        <p>{socketConnection}</p>
        <Link href="/game-table">
          <a>
            <h2>Game Table</h2>
          </a>
        </Link>

        <Link href="/table/[name]" as={`/table/${tableName}`}>
          <a>
            <h2>{tableName}</h2>
          </a>
        </Link>

      </section>
    </Layout>
  )
}

// export async function getStaticProps() {
//   const res = await fetch(...)
//   const messages = await res.json()

//   return {
//     props: {
//       messages
//     }
//   }
// }
