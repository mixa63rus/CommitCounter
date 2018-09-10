import React from 'react';

import Input from './Input';

function LoginForm({ onClickLogin, onClickSignup, onChangeEmail, onChangePassword, email, password }) {
    return (
        <form className="signup-form">
            <Input type="email" name="email" placeholder="email" onChange={onChangeEmail} value={email}/>
            <Input type="password" name="password" placeholder="password" onChange={onChangePassword} value={password}/>
            <button type="submit" className="mdc-button mdc-button--primary mdc-button--raised" onClick={onClickLogin}>Signin</button>
            <button type="submit" className="mdc-button mdc-button--primary mdc-button--raised" onClick={onClickSignup}>SignUp</button>
        </form>
    );
}

export default LoginForm;