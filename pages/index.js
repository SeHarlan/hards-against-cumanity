import Head from 'next/head'
import Layout from '../components/Layout/Layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>
        <h1>Home Page</h1>
      </section>
    </Layout>
  )
}
