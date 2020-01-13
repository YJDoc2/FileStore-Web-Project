import React, { Component } from 'react';
import axios from 'axios';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = { source: '' };
    }

    componentDidMount() {
        axios
            .get(this.props.path, { responseType: 'arraybuffer' })
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                this.setState({ source: 'data:;base64,' + base64 });
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    render() {
        let classname = this.props.thumbnail
            ? 'card-img-top img-thumbnail'
            : 'img-fluid';
        let style = this.props.thumbnail ? { height: '12rem' } : {};
        return (
            <img
                className={classname}
                style={style}
                src={this.state.source}
                alt={this.props.alt}
            />
        );
    }
}

export default Image;
