import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { GlobalContext } from './Context';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            err: null,
            username: '',
            password: ''
        };
    }

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    };
    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ ...this.state, info: 'Sending...' });
        if (
            this.state.username.trim() === '' ||
            this.state.password.trim() === ''
        ) {
            return this.setState({
                ...this.state,
                err: 'Please Fill All Details'
            });
        }
        try {
            let res = await axios.post('/api/user/login', {
                username: this.state.username,
                password: this.state.password
            });
            this.setState({
                username: '',
                password: '',
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
                            <h2>Log IN</h2>
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
                        </div>
                        <div className='form-group'>
                            <label>Password</label>
                            <input
                                className='form-control'
                                type='password'
                                name='password'
                                value={this.state.password1}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='p-5'></div>
                        <div className='p-4'></div>
                        <div className='form-group'>
                            <input
                                type='submit'
                                className='btn btn-primary'
                                value='Log In'
                            />
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

LoginForm.contextType = GlobalContext;
export default withRouter(LoginForm);
