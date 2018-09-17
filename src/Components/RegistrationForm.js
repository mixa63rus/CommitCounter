import React from 'react';
import { Form, FormGroup, Col, ControlLabel, Button } from 'react-bootstrap';

import Input from './Input';

function RegistrationForm({ onClickSignup, onChangeEmail, onChangePassword, onChangeNickName, email, password, nickname }) {
    return (
        <Form horizontal>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                    Email
                </Col>
                <Col xs={6} sm={6}>
                    <Input type="email" name="email" placeholder="email" onChange={onChangeEmail} value={email}/>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                    Password
                </Col>
                <Col xs={6} sm={6}>
                    <Input type="password" name="password" placeholder="password" onChange={onChangePassword} value={password}/>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                    NickName
                </Col>
                <Col xs={6} sm={6}>
                    <Input type="text" name="text" placeholder="nickname" onChange={onChangeNickName} value={nickname}/>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={4} sm={4}>
                </Col>
                <Col xs={6} sm={6}>
                    <Button type="submit" bsStyle="primary" onClick={onClickSignup}>SignUp</Button>
                </Col>
            </FormGroup>
        </Form>
    );
}

export default RegistrationForm;
