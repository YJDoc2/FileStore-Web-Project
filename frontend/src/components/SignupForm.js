import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { GlobalContext } from './Context';

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            err: null,
            username: '',
            password1: '',
            password2: ''
        };
    }
    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    };
    handleSubmit = async (e, setUser) => {
        e.preventDefault();
        this.setState({ ...this.state, info: 'Sending...' });
        if (
            this.state.username.trim() === '' ||
            this.state.password1.trim() === '' ||
            this.state.password2.trim() === ''
        ) {
            return this.setState({
                ...this.state,
                err: 'Please Fill All Details'
            });
        }
        if (this.state.password1 !== this.state.password2) {
            return this.setState({
                ...this.state,
                err: 'Passwords Does not Match'
            });
        }
        try {
            let res = await axios.post('/api/user/register', {
                username: this.state.username,
                password: this.state.password1
            });
            this.setState({
                username: '',
                password1: '',
                password2: '',
                err: null,
                info: 'Sucessful!'
            });
            this.context.setUser(res.data.user);
            this.props.history.push('/');
        } catch (error) {
            return this.setState({
                ...this.state,
                info: null,
                err: error.response ? error.response.data.err : error.message
            });
        }
    };

    render() {
        let errMsg = null;
        let info = null;
        if (this.state.err !== null) {
            errMsg = (
                <div className=' p-2 mb-3 rounded bg-danger text-white text-center'>
                    {this.state.err}
                </div>
            );
        }
        if (this.state.info !== null) {
            info = (
                <div className=' p-2 mb-3 rounded bg-info text-white text-center'>
                    <h3>{this.state.info}</h3>
                </div>
            );
        }
        return (
            <React.Fragment>
                <div
                    className='d-md-flex p-5 mb-5'
                    style={{ backgroundColor: '#F2F1F1' }}
                >
                    <form onSubmit={this.handleSubmit}>
                        <div className='mb-3 text-center'>
                            <h2>Register</h2>
                        </div>
                        {info}
                        {errMsg}
                        <div className='form-group'>
                            <label>Username</label>
                            <input
                                className='form-control'
                                type='text'
                                name='username'
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                            <small className='form-text text-muted'>
                                Usename Should be unique
                            </small>
                        </div>
                        <div className='form-group'>
                            <label>Password</label>
                            <input
                                className='form-control'
                                type='password'
                                name='password1'
                                value={this.state.password1}
                                onChange={this.handleChange}
                            />
                            <small className='form-text text-muted'>
                                Use a Strong password!
                            </small>
                        </div>
                        <div className='form-group'>
                            <label>Confirm Password</label>
                            <input
                                className='form-control'
                                type='password'
                                name='password2'
                                value={this.state.password2}
                                onChange={this.handleChange}
                            />
                            <small className='form-text text-muted'>
                                Just Checking...!
                            </small>
                        </div>
                        <div className='form-group'>
                            <input
                                type='submit'
                                className='btn btn-primary'
                                value='Register'
                            />
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

SignupForm.contextType = GlobalContext;

export default withRouter(SignupForm);
