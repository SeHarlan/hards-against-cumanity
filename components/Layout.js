import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import utilStyles from '../styles/utils.module.css'

export const siteTitle = 'Hards Against Cumanity'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Cards Against Humanity Online. Not associated with the acctual company, plz buy their stuff!"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap" rel="stylesheet" />

        <title>Hards Against Cumanity</title>
      </Head>
      <header className={styles.header}>
        <img
          src="/images/hac.png"
          className={styles.headerImage}
          alt={siteTitle}
        />
      </header>

      <main>
        {children}
      </main>

      {/* <footer className={styles.backToHome}>
        footer info goes here
      </footer> */}
    </div>
  )
}