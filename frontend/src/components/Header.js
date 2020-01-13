import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Consumer, GlobalContext } from './Context';

class Header extends Component {
    loginLink = (
        <Link
            className='nav-item nav-link ml-auto'
            style={{ fontSize: '1.5rem' }}
            to='/login'
        >
            Login/Signup
        </Link>
    );
    logoutLink = (
        <Link
            className='nav-item nav-link ml-auto'
            to='/'
            style={{ fontSize: '1.5rem' }}
            onClick={this.context.logout}
        >
            Logout
        </Link>
    );
    collectionLink = (
        <Link
            to='/collections'
            className='nav-item nav-link ml-auto'
            style={{ fontSize: '1.5rem' }}
        >
            Collections
        </Link>
    );

    render() {
        return (
            <Consumer>
                {context => (
                    <nav
                        className='navbar navbar-expand-lg navbar-light d-flex'
                        style={{ backgroundColor: '#e3f2fd' }}
                    >
                        <Link
                            className='navbar-brand '
                            style={{ fontSize: '2rem' }}
                            to='/'
                        >
                            FileStore
                        </Link>
                        {context.state.isLoggedIn ? (
                            <div
                                className='nav-item ml-auto '
                                style={{ fontSize: '1.5rem' }}
                            >
                                Welcome, {context.state.user.username}
                            </div>
                        ) : null}
                        {context.state.isLoggedIn ? this.collectionLink : null}
                        {context.state.isLoggedIn
                            ? this.logoutLink
                            : this.loginLink}
                    </nav>
                )}
            </Consumer>
        );
    }
}

Header.contextType = GlobalContext;

Header.protoTypes = {
    loggedIn: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired
};

export default Header;
