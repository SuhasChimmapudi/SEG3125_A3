export default function MemoryCard({ handleClick }) {
  const emojiArray = ['🐵', '🐷', '🐙', '🪲', '🐵', '🐷', '🐙', '🪲', '🐵']

  const emojiEl = emojiArray.map((emoji, index) =>
    <li key={index} className="card-item">
      <button
        className="btn btn--emoji"
        onClick={handleClick}
      >
        {emoji}
      </button>
    </li>
  )

  return <ul className="card-container">{emojiEl}</ul>
}