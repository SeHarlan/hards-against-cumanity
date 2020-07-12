import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useState, useRef } from 'react'
import useSocket from '../lib/useSocket'
import CopyButton from '../components/CopyButton'

export default function Home() {
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [invalidName, setInvalidName] = useState(false)

  const socket = useSocket()

  useSocket('INVALID_SIGN_UP', () => {
    setName('')
    setText('')
    setInvalidName(true)
  })

  const copyRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await fetch('/api/pathnames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text),
      })
        .then(res => res.json())
        .then(res => console.log('made room: ', res))

      setName(text)
      setInvalidName(false)
      socket.emit("CREATE_ROOM", text)
      setText('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout home>
      <section className={utilStyles.headingMd}>

        <Link href="/game-table" as="/community">
          <a>
            <h2>Community Game Table</h2>
          </a>
        </Link>

        <form className={utilStyles.buttonContainer} onSubmit={handleSubmit}>
          <div />
          <input
            className={utilStyles.input}
            type="text"
            value={text}
            onChange={({ target }) => setText(target.value)}
            placeholder="Room Name"
          />
          <button className={`${utilStyles.button} ${utilStyles.white} ${!text && utilStyles.buttonDisabled}`} disabled={!text}>Create Room</button>
        </form>
        {invalidName && <em className={utilStyles.cardsRemaining}>Room Name Already Taken</em>}

        {name && <Link href="/[name]" as={`/${name}`}>
          <a>
            <h2 ref={copyRef} >{process.env.NEXT_PUBLIC_URL_BASE}{name}</h2>
          </a>
        </Link>}

        {/* {name && <CopyButton ref={copyRef} />} */}

      </section>
    </Layout>
  )
}
