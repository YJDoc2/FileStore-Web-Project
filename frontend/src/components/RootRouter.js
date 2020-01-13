import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import Home from './Home';
import FileView from './FileView';
import Axios from 'axios';
import { Provider } from './Context';
import CollectionPage from './CollectionPage';
import CollectionView from './CollectionView';
import ErrorPage from './404ErrorPage';

class RootRouter extends Component {
    state = {
        user: null,
        isLoggedIn: false
    };

    componentDidMount() {
        Axios.defaults.withCredentials = true;
    }
    addFiles = files => {
        let user = this.state.user;
        user.files.push(...files);
        this.setState({ user: user, isLoggedIn: true });
    };
    addCollection = files => {
        let user = this.state.user;
        user.collections.push(...files);
        this.setState({ user: user, isLoggedIn: true });
    };
    deleteCollection = async name => {
        try {
            let res = await Axios.delete(`/api/collection/${name}`);
            this.setUser(res.data.user);
        } catch (e) {
            console.log(e);
        }
    };
    setUser = user => {
        if (user === null || user === undefined) {
            return this.logout();
        }
        this.setState({ user: user, isLoggedIn: true });
    };
    logout = () => {
        this.setState({ user: null, isLoggedIn: false });
    };
    deleteFile = async file => {
        try {
            let res = await Axios.delete(`/api/files/${file.dbfilename}`);
            this.setUser(res.data.user);
        } catch (e) {
            console.log(e);
        }
    };
    render() {
        return (
            <Provider
                value={{
                    state: this.state,
                    setUser: this.setUser,
                    logout: this.logout,
                    addFiles: this.addFiles,
                    deleteFile: this.deleteFile,
                    addCollection: this.addCollection,
                    deleteCollection: this.deleteCollection
                }}
            >
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/login' component={LoginSignup} />
                        <Route
                            exact
                            path='/file/:filename'
                            component={FileView}
                        />
                        <Route
                            exact
                            path='/collection/:name'
                            component={CollectionView}
                        />
                        <Route
                            exact
                            path='/collections'
                            component={CollectionPage}
                        />
                        <Route component={ErrorPage} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default RootRouter;
