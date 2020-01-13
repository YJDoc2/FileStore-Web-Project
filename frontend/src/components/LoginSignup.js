import React, { Component } from 'react';
import Header from './Header';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

class LoginSignup extends Component {
    render() {
        return (
            <React.Fragment>
                <Header></Header>
                <div className='container mt-5'>
                    <div className='d-md-flex flex-row mb-3 justify-content-around'>
                        <SignupForm></SignupForm>
                        <LoginForm></LoginForm>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default LoginSignup;
