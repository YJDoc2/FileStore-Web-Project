import React, { Component } from 'react';
import Header from './Header';
import bsCustomFileInput from 'bs-custom-file-input';
import $ from 'jquery';
import { Link, Redirect } from 'react-router-dom';
import { GlobalContext } from './Context';
import CollectionCard from './CollectionCard';

class CollectionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            files: null
        };
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }
    fileAddHandler = e => {
        let totalSize = 0;
        for (let x = 0; x < e.target.files.length; x++) {
            totalSize += e.target.files.size;
        }

        if (totalSize > 20000000) {
            let errStr = `Cannot upload as Maximum allowed space for a single collection is 20MB`;
            return this.setState({ ...this.state, info: errStr });
        }
        this.setState({
            ...this.state,
            input: e.target,
            info: null,
            files: e.target.files
        });
    };
    submitFiles = async e => {
        const data = new FormData();
        if (this.state.files === null) {
            return this.setState({
                ...this.state,
                info: 'Please Select Files'
            });
        }

        for (let x = 0; x < this.state.files.length; x++) {
            data.append('files', this.state.files[x]);
        }
        $.ajax({
            type: 'POST',
            url: `/api/upload/collection/${this.state.name}`,
            xhrFields: {
                withCredentials: true
            },
            data: data,
            contentType: false,
            processData: false,
            cache: false,
            success: res => {
                this.setState({
                    info: 'Successfully uploaded',
                    files: res.files,
                    key: Date.now()
                });

                this.context.addCollection(res.files);
                setTimeout(() => {
                    this.setState({ ...this.state, info: null });
                }, 500);
            },
            error: e => {
                let errStr = e.responseJSON ? e.responseJSON.err : null;
                console.log(e);
                this.setState({
                    ...this.state,
                    info: errStr || 'Unknown Error Occurred'
                });
            }
        });
    };

    handleChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    };

    inputForm = (
        <div>
            <div className='input-group'>
                <div className='custom-file'>
                    <input
                        type='file'
                        multiple
                        formEncType='multipart/form-data'
                        className='custom-file-input'
                        id='inputGroupFile04'
                        aria-describedby='inputGroupFileAddon04'
                        onChange={this.fileAddHandler}
                    />
                    <label
                        className='custom-file-label'
                        htmlFor='inputGroupFile04'
                    >
                        Choose file
                    </label>
                </div>
                <div className='input-group-append'>
                    <button
                        className='btn btn-success'
                        type='button'
                        id='inputGroupFileAddon04'
                        onClick={this.submitFiles}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );

    render() {
        let cols;
        if (this.context.state.isLoggedIn) {
            cols = new Set();
            this.context.state.user.collections.forEach(coll => {
                cols.add(coll.name);
            });
        }
        return (
            <div>
                {this.context.state.isLoggedIn ? (
                    <React.Fragment>
                        <Header></Header>
                        {this.state.info}
                        <div className='container'>
                            <Link
                                to='/'
                                className='btn btn-primary btn-block mt-2'
                            >
                                Home
                            </Link>
                        </div>
                        <div className='container mt-5'>
                            <div className='form-group'>
                                <label>Collection Name : </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    name='name'
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </div>
                            {this.inputForm}
                        </div>

                        <div className='container mt-5'>
                            <div className='row m-2'>
                                {Array.from(cols).map(coll => {
                                    return (
                                        <div
                                            key={coll}
                                            className='col-sm-6 col-md-4 col-lg-4 my-2'
                                        >
                                            <CollectionCard name={coll} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <Redirect to='/' />
                )}
            </div>
        );
    }
}

CollectionPage.contextType = GlobalContext;
export default CollectionPage;
