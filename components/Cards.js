export function WhiteCard({ text }) {
  return <span dangerouslySetInnerHTML={{ __html: text }}></span>
}

export function BlackCard({ text }) {
  const newText = text.replace(/_/g, '______')
  return <h3 dangerouslySetInnerHTML={{ __html: newText }}></h3>
}