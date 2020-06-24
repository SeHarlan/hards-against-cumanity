import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

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

        <title>Hards Against Cumanity</title>
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/hac.png"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={siteTitle}
            />
            <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
          </>
        ) : (
            <>
              <Link href="/">
                <a>
                  <img
                    src="/images/hac.png"
                    className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                    alt={siteTitle}
                  />
                </a>
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href="/">
                  <a className={utilStyles.colorInherit}>{siteTitle}</a>
                </Link>
              </h2>
            </>
          )}
      </header>

      <main>
        {children}
      </main>

      {!home && (
        <footer className={styles.backToHome}>
          <Link href="/">
            <a>Back to Home</a>
          </Link>
        </footer>
      )}

    </div>
  )
}