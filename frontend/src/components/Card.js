import React, { Component } from 'react';
import Image from './Image';
import { Link } from 'react-router-dom';
import { GlobalContext } from './Context';
class Card extends Component {
    constructor(props) {
        super(props);
        this.state = { file: props.file };
    }
    deleteFile = () => {
        this.context.deleteFile(this.state.file);
    };

    getSizeText = size => {
        if (size / 1024 < 1) {
            return size + ' Bytes';
        } else if (size / (1024 * 1024) < 1) {
            return Math.ceil(size / 1024) + ' KBs';
        } else if (size / (1024 * 1024 * 1024) < 1) {
            //* Actually not needed in this version as the maximum upload size per user is ideally less than 20MB,
            return Math.ceil(size / (1024 * 1024)) + ' MBs'; //* so this can be replace by a default return instead of else if clause, but else if is used in case of
        } //* increased storage size is allowed.
    };

    render() {
        let file = this.state.file;
        return (
            <div className='card h-100'>
                {file.ext === 'jpeg' ||
                file.ext === 'png' ||
                file.ext === 'jpg' ? (
                    <Image
                        path={`/api/files/${file.dbfilename}`}
                        thumbnail={true}
                        alt={file.originalname}
                    />
                ) : null}
                <div className='card-body'>
                    <h5 className='card-title'>{file.originalname}</h5>
                    <p>
                        Size : {this.getSizeText(file.size)}
                        <br />
                        Uploaded on :{new Date(file.date).toDateString()}
                    </p>

                    <Link
                        style={{ width: '100%' }}
                        className='btn btn-primary m-1'
                        to={{
                            pathname: `/file/${file.dbfilename}`,
                            state: { file: file }
                        }}
                    >
                        Open in Browser
                    </Link>
                    <Link
                        style={{ width: '100%' }}
                        className='btn btn-success m-1'
                        to={`/api/download/${file.dbfilename}`}
                        target='_blank'
                        download={file.originalname}
                    >
                        Download
                    </Link>
                    {!this.props.collection ? (
                        <Link
                            style={{ width: '100%' }}
                            className='btn btn-danger m-1'
                            to='/'
                            onClick={this.deleteFile}
                        >
                            Delete
                        </Link>
                    ) : null}
                </div>
            </div>
        );
    }
}

Card.contextType = GlobalContext;
export default Card;
