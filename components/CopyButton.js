import React, { useState } from 'react'
import copy from 'copy-to-clipboard'
import utilStyles from '../styles/utils.module.css'

export default function CopyButton({ textToCopy }) {
  const [check, setCheck] = useState(false)

  const handleCopy = () => {
    const text = textToCopy.replace(/ /g, '%20')
    copy(text)
    setCheck(true)
    setTimeout(() => setCheck(false), 2000)
  }

  return <button
    onClick={handleCopy}
    className={`${utilStyles.button} ${utilStyles.white}`}>
    Copy Link {check && <span>&#10003;</span>}
  </button>
}