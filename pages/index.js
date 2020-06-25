import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSocket from '../lib/useSocket'

export const tableName = 'Pick Two'

export default function Home({ messages }) {

  //Socket.io TESTING
  // const [socketConnection, setSocketConnection] = useState('')
  // const [text, setText] = useState('')
  // const socket = useSocket()
  // useSocket('TEST_RECIEVED', (data) => {
  //   setSocketConnection(data.message)
  // })
  // useSocket('TEXT', (text) => {
  //   setText(text)
  // })
  // const handleClick = () => socket.emit('FIRST_EVENT')
  // const handleText = (e) => socket.emit('TEXT', e.target.value)
  //TESTING



  return (
    <Layout home>
      <section className={utilStyles.headingMd}>

        {/* Socket Testing */}
        {/* <p>{socketConnection}</p>
        <p>testing broadcast text: {text}</p>
        <button onClick={handleClick}>Test Socket Emit</button>
        <input type="text" onChange={handleText}></input> */}

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
