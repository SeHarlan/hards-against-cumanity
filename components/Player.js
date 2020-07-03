export default function Player({ name, score, czar }) {
  return (
    <p>
      <b>{name}:</b> {score}
      {czar && <em> - Card Czar</em>}
    </p>
  )
}