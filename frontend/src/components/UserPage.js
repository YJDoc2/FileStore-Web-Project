import React, { Component } from 'react';
import { GlobalContext } from './Context';
import CardView from './CardView';
import bsCustomFileInput from 'bs-custom-file-input';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

class UserPage extends Component {
    state = {
        files: null,
        info: null
    };

    componentDidMount() {
        bsCustomFileInput.init();
    }
    fileAddHandler = e => {
        let totalSize = 0;
        for (let x = 0; x < e.target.files.length; x++) {
            totalSize += e.target.files.size;
        }

        if (totalSize > 20000000 - this.context.state.user.usedSpace) {
            let errStr = `Cannot upload as these new files will exceed your allowed space...\ncurrent used space : ${this
                .context.state.user.usedSpace /
                1000000} out of 20MB\nSize of Intended Upload : ${totalSize /
                1000000}`;
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
            url: '/api/upload/files',
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

                this.context.addFiles(res.files);
                let input = this.state.input;
                input.value = '';
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        info: null,
                        input: input
                    });
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
        let info = null;
        if (this.state.info !== null) {
            info = (
                <div className=' p-2 mb-3 mt-2 rounded bg-info text-white text-center'>
                    {this.state.info}
                </div>
            );
        }
        let display = null;
        if (this.context.state.isLoggedIn) {
            display = (
                <div className='container mt-3'>
                    {this.inputForm}
                    {info}
                    {this.context.state.user.files ? <CardView /> : null}
                </div>
            );
        } else {
            display = <Redirect to='/' />;
        }

        return <React.Fragment>{display}</React.Fragment>;
    }
}

UserPage.contextType = GlobalContext;
export default UserPage;
