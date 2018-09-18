import React from 'react';
import { Form, FormGroup, Col, ControlLabel, Button } from 'react-bootstrap';

import Input from './Input';

function LoginForm({ onClickLogin, onChangeEmail, onChangePassword, email, password }) {
    return (
        <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                    Email
                </Col>
                <Col xs={6} sm={6}>
                    <Input type="email" name="email" placeholder="email" onChange={onChangeEmail} value={email}/>
                </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                    Password
                </Col>
                <Col xs={6} sm={6}>
                    <Input type="password" name="password" placeholder="password" onChange={onChangePassword} value={password}/>
                </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                </Col>
                <Col xs={6} sm={6}>
                    <Button bsStyle="success" onClick={onClickLogin}>SignIn</Button>
                </Col>
            </FormGroup>
        </Form>
    );
}

export default LoginForm;
