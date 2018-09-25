import React from 'react';
import { Navbar, Nav, NavItem, Button, Modal } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import "./CustomNavbar.css"

export default class CustomNavbar extends React.Component {
    state = {
        showSignUp: false,
        showSignIn: false,
    }

    handleShowSignIn = (e) => {
        e.preventDefault();
        this.setState({ showSignIn: true });
    }

    handleShowSignUp = (e) => {
        e.preventDefault();
        this.setState({ showSignUp: true });
    }

    handleClose = () => {
        this.setState({ showSignIn: false, showSignUp: false });
    }

    render() {
        return (
            <div>
                <Navbar default collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                                VIED
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                    {!this.props.user ?
                        <Nav pullRight>
                            <NavItem eventKey={1}>
                                <Button bsStyle="success" style={{outline: "none"}} onClick={this.handleShowSignIn}>SignIn</Button>
                            </NavItem>
                            <NavItem eventKey={2}>
                                <Button bsStyle="primary" style={{outline: "none"}} onClick={this.handleShowSignUp}>SignUp</Button>
                            </NavItem>
                        </Nav> : 
                        <Nav pullRight>
                            <NavItem eventKey={1}>
                                {this.props.nickname}
                            </NavItem>
                            <NavItem eventKey={2}>
                                <Button bsStyle="danger" onClick={this.props.logout}>Logout</Button>
                            </NavItem>
                        </Nav>}
                    </Navbar.Collapse>
                </Navbar>
                <Modal show={this.state.showSignUp} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registration Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RegistrationForm 
                            email = {this.props.email}
                            password = {this.props.password}
                            nickname = {this.props.nickname}
                            onChangeEmail={this.props.onChangeEmail}
                            onChangePassword = {this.props.onChangePassword}
                            onClickSignup={this.props.onClickSignup} 
                            onChangeNickName={this.props.onChangeNickName}                        
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showSignIn} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoginForm 
                            email = {this.props.email}
                            password = {this.props.password}
                            onChangeEmail={this.props.onChangeEmail}
                            onChangePassword = {this.props.onChangePassword}
                            onClickLogin={this.props.onClickLogin}                         
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}
