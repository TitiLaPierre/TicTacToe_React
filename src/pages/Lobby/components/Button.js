export default function Button(props) {
    const handleClick = props.disabled ? null : props.handleClick
    return (
        <button className={"button " + (props.disabled ? "button__disabled" : "")} onClick={handleClick}>
            <div className="button--content">
                {props.context.color && <div className={props.context.style} style={{ background: props.context.color }}></div>}
                <div className="button--text">
                    {props.context.title &&
                        <h2 className="button--title">
                            {props.context.title}
                            {props.note && <p className="button--note">{props.note}</p>}
                        </h2>
                    }
                    {props.context.description && <p className="button--description">{props.context.description}</p>}
                </div>
            </div>
            {props.action.icon && <div className="button--action" style={{ background: props.action.color }}><img className="button--action--icon" src={props.action.icon} alt="" /></div>}
        </button>
    )
}