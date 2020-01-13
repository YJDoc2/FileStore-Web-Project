import React from 'react';

const UnsupportedFileType = props => {
    return (
        <React.Fragment>
            <div className='container mt-3'>
                Sorry, We do not support {props.fileType} for in-browser Display
            </div>
        </React.Fragment>
    );
};

export default UnsupportedFileType;
