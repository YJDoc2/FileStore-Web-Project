import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';
import path from 'path';
import Header from './Header';
import Image from './Image';
import UnsupportedFileType from './UnsupportedFiletype';
import { withRouter, Redirect } from 'react-router-dom';

import { GlobalContext } from './Context';
import Axios from 'axios';

class FileView extends Component {
    constructor(props) {
        super(props);
        const { filename } = this.props.match.params;
        const { file } = this.props.location.state;

        this.state = {
            filename: filename,
            file: file,
            img: null
        };
    }
    componentDidMount() {
        let ext = path
            .extname(this.state.filename)
            .toLowerCase()
            .substring(1);
        const textExt = /txt|html|htm|css|js|json|c|cpp|java|py|sh/;
        if (ext === 'png' || ext === 'jpeg' || ext === 'jpg') {
            let img = (
                <Image
                    path={`/api/files/${this.state.filename}`}
                    thumbnail={false}
                    alt={this.state.file.originalname}
                ></Image>
            );
            this.setState({ ...this.state, img: img });
        } else if (textExt.test(ext)) {
            Axios.get(`/api/files/${this.state.filename}`)
                .then(res => {
                    let lines = res.data.split(/\r\n|\r|\n/).length;

                    this.setState({
                        ...this.state,
                        text: (
                            <textarea
                                className='w-100'
                                value={res.data}
                                readOnly={true}
                                rows={lines * 1.5} //* 1.5 is multiplied as then the no. of lines will be slightly more than actuall no. of lines
                                //* to accomodate for lines overflowing.

                                style={{ resize: 'none', border: 'none' }}
                            ></textarea>
                        )
                    });
                })
                .catch(e => {
                    if (e.response.data.err) {
                        this.setState({
                            ...this.state,
                            info: e.response.data.err
                        });
                    }
                    console.log(e);
                });
        } else {
            let fView = (
                <FileViewer
                    fileType={ext}
                    filePath={`/api/files/${this.state.filename}`}
                    unsupportedComponent={UnsupportedFileType}
                />
            );
            this.setState({ ...this.state, fView: fView });
        }
    }

    staticComponents = () => {
        return (
            <React.Fragment>
                <Header></Header>
                <div className='d-flex justify-content-between m-2'>
                    <button
                        className='btn btn-primary btn-lg'
                        onClick={this.props.history.goBack}
                    >
                        Back
                    </button>

                    <h2>{this.state.file.originalname}</h2>

                    <div></div>
                </div>
            </React.Fragment>
        );
    };

    render() {
        let display;

        if (
            this.state.filename.substring(0, 4) === 'coll' ||
            (this.context.state.isLoggedIn &&
                this.context.state.user.files.some(file => {
                    return file.dbfilename === this.state.filename;
                }))
        ) {
            display = (
                <React.Fragment>
                    {this.staticComponents()}
                    {this.state.info}
                    <div className='container w-100 mt-2 text-center'>
                        {this.state.img}
                        {this.state.text}
                        {this.state.fView}
                    </div>
                </React.Fragment>
            );
        } else {
            display = <Redirect to='/' />;
        }

        return <React.Fragment>{display}</React.Fragment>;
    }
}
FileView.contextType = GlobalContext;
export default withRouter(FileView);
