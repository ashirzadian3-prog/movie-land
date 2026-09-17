import './Text.css'

function Text(props) {
    return (
        <div className='Textcontainer'>
            <label htmlFor="">{props.label}</label>
            <textarea name={props.name} onChange={props.onchange}></textarea>
        </div>
    )
}

export default Text