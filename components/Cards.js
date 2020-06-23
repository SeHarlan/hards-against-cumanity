export function WhiteCard({ text }) {
  return <p dangerouslySetInnerHTML={{ __html: text }}></p>
}

export function BlackCard({ text }) {
  const newText = text.replace(/_/g, '______')
  return <h2 dangerouslySetInnerHTML={{ __html: newText }}></h2>
}