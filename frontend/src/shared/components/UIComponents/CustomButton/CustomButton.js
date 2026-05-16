import './CustomButton.css';


const CustomButton = props => {
    if (props.href) {
        return (
            <a
                className={`button  ${props.size && `button-${props.size}`} ${props.primary &&
                    'button-primary'} ${props.danger && 'button-danger'}`}
                href={props.href}
            >
                {props.children}
            </a>
        );
    }
    else {
        return (
            <button
                className={`button ${props.size && `button-${props.size}`} ${props.primary && 'button-primary'} ${props.danger && 'button-danger'}`}
                style={props.style}
                type={props.type}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.children}
            </button>
        );
    }

};

export default CustomButton;
