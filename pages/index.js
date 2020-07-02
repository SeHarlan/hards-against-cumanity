import GameTable from './game-table'

export default GameTable

//home page for lobby system

// import Layout from '../components/Layout'
// import utilStyles from '../styles/utils.module.css'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import useSocket from '../lib/useSocket'

// export default function Home({ messages }) {
//   //TO DO for joining/creating socket room
//   // const [text, setText] = useState('')
//   // const [name, setName] = useState('')

//   // const socket = useSocket()

//   // const handleSubmit = (e) => {
//   //   e.preventDefault()
//   //   setName(text)
//   //   socket.emit("CREATE_ROOM", text)
//   //   fetch('pages/api/pathnames.js', {
//   //     method: 'POST',
//   //     headers: {
//   //       'Content-Type': 'application/json',
//   //     },
//   //     body: JSON.stringify(text),
//   //   }).then(res => console.log('client side res', res.json()))
//   // }
//   return (
//     <Layout home>
//       <section className={utilStyles.headingMd}>

//         <Link href="/game-table">
//           <a>
//             <h2>Game Table</h2>
//           </a>
//         </Link>

//         {/* <form onSubmit={handleSubmit}>
//           <input value={text} onChange={({ target }) => setText(target.value)} />
//           <button>Create Room</button>
//         </form> */}

//         {/* {name && <Link href="/table/[name]" as={`/table/${name}`}>
//           <a>
//             <h2>{name}</h2>
//           </a>
//         </Link>} */}

//       </section>
//     </Layout>
//   )
// }
