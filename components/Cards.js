import React from 'react'

export function WhiteCard({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }}></div>
}

export function BlackCard({ text }) {
  const newText = text.replace(/_/g, '______')
  return <div dangerouslySetInnerHTML={{ __html: newText }}></div>
}