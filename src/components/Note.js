/**
 *
 * A component used to create notes including colored text.
 *
 * @param {object} props - The props of the component.
 * @param {string} props.children - The text of the note.
 * @param {string} props.color - The color of the text surrounded by **.
 * 
 * @returns {JSX.Element} - The JSX element representing the note.
 *
 */
export default function Note(props) {
    console.log(props)
    return <p className="note">
        {props.children.split("**").map((text, i) => {
            if (i % 2 === 0)
                return text
            return <span key={i} style={{ color: props.color }}>{text}</span>
        })}
    </p> 
}