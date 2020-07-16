import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export const siteTitle = 'Hards Against Cumanity'

export default function Layout({ children, home }) {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Cards Against Humanity Online. Not associated with the actual company, plz buy their stuff!"
          />

          <meta property="og:title" content={siteTitle} />
          <meta property="og:image" content="https://imgur.com/a/rs60o2j" />
          <meta property="og:image:secure_url" content="https://imgur.com/a/rs60o2j" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="552" />
          <meta property="og:image:height" content="214" />
          <meta property="og:image:alt" content="Hards Against Humanity" />
          <meta name="twitter:card" content="summary_large_image" />



          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>

          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap" rel="stylesheet" />

          <title>Hards Against Cumanity</title>
        </Head>
        <header className={styles.header}>
          <Link href="/">
            <a>
              <img
                src="/images/hac.png"
                className={`${styles.headerImage} ${home && styles.imageHome}`}
                alt={siteTitle}
              />
            </a>
          </Link>
        </header>

        <main>
          {children}
        </main>

      </div >
      {home && <div className={styles.footBuffer} />}
      <footer className={`${styles.footer} ${home && styles.footerHome}`}>
        <p>
          This is a personal project made by Scott Harlan. If you encounter any bugs or have any suggestions for how to improve the site please contact me at <a href="mailto:seharlan@gmail.com" target="_blank" rel="noopener noreferrer"> seharlan@gmail.com</a> or via <a href="https://www.linkedin.com/in/scottharlan-pnw/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>

        <em>*I do not own any rights to Cards Against Humanity. Please go buy their physical cards sets and support this awesome company!</em>
        <br />
        <em>**Cards Against Humanity legal people! If I have infringed on any copyright material please let me know and I will change what needs to be changed ASAP.</em>
      </footer>
    </>
  )
}