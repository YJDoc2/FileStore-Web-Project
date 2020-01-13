import React from 'react';
import Header from './Header';
const ErrorPage = () => {
    return (
        <React.Fragment>
            <Header></Header>
            <div className='container mt-2'>
                <h1>Sorry, We cant find what you are Looking for...</h1>
                <h3>Please check the URL...</h3>
            </div>
        </React.Fragment>
    );
};

export default ErrorPage;
