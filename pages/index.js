import Head from 'next/head'
import Layout from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export const tableName = 'Custom'

export default function Home() {
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>
        <Link href="/game-table">
          <a>
            <h2>Game Table</h2>
          </a>
        </Link>

        <Link href="/table/[...name]" as={`/table/${tableName}`}>
          <a>
            <h2>{tableName}</h2>
          </a>
        </Link>
        <Link href="/table/[...name]" as={`/table/${tableName}/pick-two`}>
          <a>
            <h2>{tableName} with "pick two" black cards</h2>
          </a>
        </Link>

      </section>
    </Layout>
  )
}
