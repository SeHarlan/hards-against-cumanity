import React from 'react'

export default function CopyButton({ ref }) {
  const handleCopy = () => {
    ref.current.focus()
    document.execCommand("copy")
  }
  return <button onClick={handleCopy}>
    Copy to Clipboard
  </button>
}