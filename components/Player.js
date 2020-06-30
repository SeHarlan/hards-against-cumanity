export default function Player({ name, score, czar }) {
  return (
    <>
      <p>
        {czar && <em>Card Czar - </em>}
        <b>{name}:</b> {score}
      </p>
    </>
  )
}