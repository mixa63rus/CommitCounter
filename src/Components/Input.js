import React from 'react';

function Input({ type, name, placeholder, onChange, value }) {
    return (
        <div className="mdc-textfield">
            <input 
                type={type}
                name={name}
                placeholder={placeholder}
                className="mdc-textfield__input"
                onChange={onChange}
                value={value}
            />
        </div>
    )
}

export default Input;
