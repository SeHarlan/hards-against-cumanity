import Link from 'next/link';
import Layout from '../components/layout/layout';

export default function GameTable() {
  return (
    <Layout>
      <section>
        <Link href="/"><a>Home</a></Link>
      </section>
    </Layout>
  )
}