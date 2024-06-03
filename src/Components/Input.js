import React from 'react';

function InputComponent ({ type, id, label,customClass, value, onChange, placeholder, required,isdisabled}){
    const currentDate = new Date().toISOString().split('T')[0];
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                className={customClass}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={isdisabled}
                max={currentDate}
            />
        </div>
    );
};
export default InputComponent