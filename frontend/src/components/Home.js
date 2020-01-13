import React, { Component } from 'react';
import Header from './Header';
import { GlobalContext, Consumer } from './Context';
import UserPage from './UserPage';

class Home extends Component {
    staticText = (
        <div className='container mt-5 '>
            <h4>
                FileStore is a cloud file storing and sharing platform. It uses
                Atlas MongoDB to store and Share Files.
            </h4>
            <h5>
                This is a small scale project done using ExpressJs Backend,
                ReactJs frontend Mongoose ODM,Bootstrap Css
            </h5>
            <h5>
                Log in to Store your files. Files can be stored in two ways : in
                Personal Account, Which can be accessed only by the user
                uploading it, and in Collections, which can be Shared and viewed
                by others.
            </h5>
        </div>
    );
    render() {
        return (
            <Consumer>
                {context => (
                    <React.Fragment>
                        <Header></Header>
                        {context.state.isLoggedIn ? (
                            <UserPage />
                        ) : (
                            this.staticText
                        )}
                    </React.Fragment>
                )}
            </Consumer>
        );
    }
}

Home.contextType = GlobalContext;

export default Home;
