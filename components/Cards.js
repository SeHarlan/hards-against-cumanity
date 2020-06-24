import React from 'react'

export function WhiteCard({ text }) {
  if (!text) return (<></>)
  return <span dangerouslySetInnerHTML={{ __html: text }}></span>
}

export function BlackCard({ text }) {
  if (!text) return (<></>)
  const newText = text.replace(/_/g, '______')
  return <h2 dangerouslySetInnerHTML={{ __html: newText }}></h2>
}