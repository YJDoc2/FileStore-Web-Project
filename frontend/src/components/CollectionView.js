import React, { Component } from 'react';
import Header from './Header';
import Card from './Card';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

class CollectionView extends Component {
    constructor(props) {
        super(props);
        const { name } = this.props.match.params;

        this.state = {
            name: name,
            createrName: '',
            files: null,
            noColl: false
        };
    }
    componentDidMount() {
        Axios.get(`/api/collection/${this.state.name}`)
            .then(res => {
                let collection = res.data.collection;
                let creater = collection.creater;

                this.setState({
                    ...this.state,
                    createrName: creater,
                    files: collection.files
                });
            })
            .catch(e => {
                console.log(e);
                if (!e.response.data.success) {
                    this.setState({ ...this.state, noColl: true });
                }
            });
    }

    render() {
        return (
            <React.Fragment>
                <Header></Header>
                {this.state.noColl ? (
                    <div className='container mt-2 text-center'>
                        <h1>
                            Sorry, No collection With name '{this.state.name}'
                            Exists.
                        </h1>
                    </div>
                ) : (
                    <div className='container mt-2 text-center'>
                        <div className='d-flex justify-content-between '>
                            <button
                                className='btn btn-primary  px-2'
                                onClick={this.props.history.goBack}
                            >
                                Back
                            </button>
                            <div>
                                <h2>Collection {this.state.name}</h2>
                                <h4>Created by : {this.state.createrName}</h4>
                            </div>
                            <div></div>
                        </div>

                        {this.state.files ? (
                            <div className='row m-2'>
                                {this.state.files.map(file => (
                                    <div
                                        key={file.dbfilename}
                                        className='col-sm-6 col-md-4 col-lg-4 my-2'
                                    >
                                        <Card
                                            file={file}
                                            collection={true}
                                            collName={this.state.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default withRouter(CollectionView);
