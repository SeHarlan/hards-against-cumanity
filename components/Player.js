export default function Player({ name, score, czar, status }) {
  return (
    <div>

      <p><b>{name}</b>: {score} points</p>
      {/* {czar ? <em> - Card Czar</em> : <em> - {status}</em>} */}
      <em>{czar && "Card Czar"} ({status})</em>
    </div>
  )
}