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
            <h5>
                A single User can have 20MB of files in private , and any
                collection can have Maximum of 20MB of files in it.
            </h5>
            <br />
            <h5>
                There are still many bugs and feature updates possible. Few of
                them are :
                <br />
                <br />
                <ul>
                    <li>
                        The File upload does not clear itself after uploading
                        files, even though there are no Files still assosiated
                        with it .
                    </li>
                    <br />
                    <li>
                        The Collections are static, as in once created and
                        uploaded, files cannot be added or removed from
                        them.This was not done as the collection files are
                        showed on same route for all viewers, logged in as well
                        as not. The logic to check whether a collection belongs
                        to current logged in user , so only creater can have
                        update rights was becoming complecated.
                    </li>
                    <br />
                    <li>
                        The npm package 'react-file-viewer' used to display some
                        file types does not scale the pages of pdf well, which
                        is an internal issue of package.
                    </li>
                    <br />
                    <li>
                        The GridFS-Stream package used in the backend uses
                        outdated drivers,and thus does not support some updated
                        methods of mongoDB. A possible solution would be to
                        change the package used or create a custom interface
                        over MongoDB Grid interface.
                    </li>
                    <br />
                    <li>
                        The Backend cannot currently limit incoming files in
                        uploading other than the size less than 20MB. Thus a
                        user may extend the allowed space by using REST clients
                        such as Postman to upload files. This may be stopped
                        using cors. Currently the file size per user is checked
                        and handled by frontend before upload
                    </li>
                </ul>
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
