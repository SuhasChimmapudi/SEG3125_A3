import { decodeEntity } from 'html-entities'

export default function MemoryCard({ handleClick, data }) {
    const emojiEl = data.map((emoji, index) =>
        <li key={index} className="card-item">
            <button
                className="btn btn--emoji"
                onClick={handleClick}
            >
                {decodeEntity(emoji.htmlCode[0])}
            </button>
        </li>
    )
    
    return <ul className="card-container">{emojiEl}</ul>
}