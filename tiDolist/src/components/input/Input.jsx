import './Input.css'

function Input(props) {


    return (
        <div className="inputcontainer">
            <label htmlFor="">{props.label}</label>
            <input type={props.type} name={props.name} onChange={props.onchange} />
        </div>
    )
}

export default Input;