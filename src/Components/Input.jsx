import React from 'react';

function Input({ type, name, placeholder, onChange, value }) {
    return (
        <div>
            <input 
                type={type}
                name={name}
                placeholder={placeholder}
                className="form-control mr-sm-2"
                onChange={onChange}
                value={value}
            />
        </div>
    )
}

export default Input;
