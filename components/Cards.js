import React from 'react'
import styles from '../styles/Cards.module.css'
import utilStyles from '../styles/utils.module.css'

export function WhiteCard({ notActive, text }) {
  if (!text) return (<></>)
  return (
    <div className={`${styles.card} ${utilStyles.white} ${notActive && styles.notActive}`}>
      <p className={utilStyles.noMargin} dangerouslySetInnerHTML={{ __html: text }}></p>
      <img className={styles.logo} src="/images/blacklogo.png" />
    </div>
  )
}

export function BlackCard({ text }) {
  if (!text) return (<></>)
  const newText = text.replace(/_/g, '______')
  return (
    <div className={`${styles.card} ${utilStyles.black}`}>
      <p className={utilStyles.noMargin} dangerouslySetInnerHTML={{ __html: newText }}></p>
      <img className={styles.logo} src="/images/whitelogo.png" />
    </div>
  )
}