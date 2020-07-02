import React from 'react'
import styles from '../styles/Cards.module.css'
import utilStyles from '../styles/utils.module.css'

export function WhiteCard({ text }) {
  if (!text) return (<></>)
  return (
    <div className={`${styles.card} ${styles.white}`}>
      <p className={utilStyles.noMargin} dangerouslySetInnerHTML={{ __html: text }}></p>
      <img className={styles.logo} src="/images/HACblack.png" />
    </div>
  )
}

export function BlackCard({ text }) {
  if (!text) return (<></>)
  const newText = text.replace(/_/g, '______')
  return (
    <div className={`${styles.card} ${styles.black}`}>
      <p className={utilStyles.noMargin} dangerouslySetInnerHTML={{ __html: newText }}></p>
      <img className={styles.logo} src="/images/HACwhite.png" />
    </div>
  )
}