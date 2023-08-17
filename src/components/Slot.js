/**
 *
 * A component used to create an interactive slot for in-game tic-tac-toe.
 *
 * @param {object} props - The props of the component.
 * @param {object} props.handlers - Event handlers for the slot.
 * @param {boolean} props.disabled - The disabled state of the slot.
 * @param {string} props.color - The color of the slot.
 * 
 * @returns {JSX.Element} - The JSX element representing the slot.
 *
 */
export default function Slot(props) {
    return <button className="slot" style={{ backgroundColor: props.color }} disabled={props.disabled} {...props.handlers}></button>
}