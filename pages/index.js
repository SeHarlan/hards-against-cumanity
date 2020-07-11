import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSocket from '../lib/useSocket'

export default function Home() {
  const [text, setText] = useState('')
  const [name, setName] = useState('')

  const socket = useSocket()

  const handleSubmit = async (e) => {
    e.preventDefault()

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
    socket.emit("CREATE_ROOM", text)
  }
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>

        <Link href="/game-table">
          <a>
            <h2>Game Table</h2>
          </a>
        </Link>

        <form onSubmit={handleSubmit}>
          <input value={text} onChange={({ target }) => setText(target.value)} />
          <button>Create Room</button>
        </form>

        {name && <Link href="/[name]" as={`/${name}`}>
          <a>
            <h2>{process.env.URL_BASE}{name}</h2>
          </a>
        </Link>}

      </section>
    </Layout>
  )
}
