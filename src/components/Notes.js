/**
 *
 * A component used to create notes including colored text.
 *
 * @param {object} props - The props of the component.
 * @param {string} props.notes - A list containing the texts to display.
 * @param {string} props.notes[].content - The text to display.
 * @param {string} props.notes[].color - The color of the text.
 * 
 * @returns {JSX.Element} - The JSX element representing the note.
 *
 */
export default function Notes(props) {
    return (
        <p className="notes">
            {props.notes.map((note, i) => {
                return (
                    <span className="note" key={i}>
                        {note.content.split("**").map((text, i) => {
                            if (i % 2 === 0)
                                return text
                            return <span key={i} style={{ color: note.color }}>{text}</span>
                        })}
                    </span>
                )
            })}
        </p>
    )
}