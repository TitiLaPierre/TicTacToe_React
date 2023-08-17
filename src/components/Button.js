import "~/css/button.css"

/**
 *
 * A component used to create a button with various aspects.
 *
 * @param {object} props - The props of the component.
 * @param {object} props.handlers - Event handlers for the button.
 * @param {boolean} props.disabled - The disabled state of the button.
 *
 * @param {object} [props.decoration] - The decoration part of the button.
 * @param {string} props.decoration.style - The CSS class of the decoration.
 * @param {string} props.decoration.color - The color of the decoration.
 *
 * @param {object} props.context - The context part of the button.
 * @param {string} props.context.title - The title of the button.
 * @param {string} [props.context.note] - An optional note for the button.
 * @param {string} props.context.description - The description of the button.
 * 
 * @param {object} props.action - The action part of the button.
 * @param {string} props.action.icon - The icon representing the action.
 * @param {string} props.action.color - The color of the action.
 * 
 * @returns {JSX.Element} - The JSX element representing the button.
 *
 */
export default function Button(props) {
    return (
        <button className="button" disabled={props.disabled} {...props.handlers}>
            <div className="button--content">
                {props.decoration && <div className={props.decoration.style} style={{ background: props.decoration.color }}></div>}
                <div className="button--text">
                    <h2 className="button--title">
                        {props.context.title}
                        {props.context.note && <p className="button--note">{props.context.note}</p>}
                    </h2>
                    <p className="button--description">{props.context.description}</p>
                </div>
            </div>
            <div className="button--action" style={{ background: props.action.color }}>
                <img className="button--action--icon" src={props.action.icon} alt="" />
            </div>
        </button>
    )
}