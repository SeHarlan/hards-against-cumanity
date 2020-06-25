import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSocket from '../lib/useSocket'

export const tableName = 'Pick Two'

export default function Home({ messages }) {

  const [socketConnection, setSocketConnection] = useState('')
  const [text, setText] = useState('')

  useSocket('TEST_RECIEVED', (data) => {
    setSocketConnection(data.message)
  })

  useSocket('TEXT', (text) => {
    setText(text)
  })

  const socket = useSocket()
  const handleClick = () => socket.emit('FIRST_EVENT')
  const handleText = (e) => socket.emit('TEXT', e.target.value)


  return (
    <Layout home>
      <section className={utilStyles.headingMd}>

        <p>{socketConnection}</p>
        <p>testing broadcast text: {text}</p>
        <button onClick={handleClick}>Test Socket Emit</button>
        <input type="text" onChange={handleText}></input>


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
