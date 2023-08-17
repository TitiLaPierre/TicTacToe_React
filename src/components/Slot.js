export default function Slot(props) {
    return <button onClick={props.handleClick} className="slot" style={{ backgroundColor: props.color }}></button>
}