import Head from 'next/head'

function Layout({children}) {
  return (
    <>
      <Head>
        <title>Hards Against Cumanity</title>
      </Head>
      <main>
        {children}
      </main>
    </>
  )
}
export default Layout