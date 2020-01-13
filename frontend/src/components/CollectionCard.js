import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from './Context';

class CollectionCard extends Component {
    state = {};
    deleteCollection = () => {
        this.context.deleteCollection(this.props.name);
    };
    render() {
        let name = this.props.name;
        let colls = this.context.state.user.collections;
        let sampleElem = colls[0];
        let num = colls.filter(coll => coll.name === name).length;

        return (
            <div className='card h-100'>
                <div className='card-body'>
                    <h5 className='card-title'>{name}</h5>
                    <p>
                        Number of Files : {num}
                        <br />
                        Uploaded on :{new Date(sampleElem.date).toDateString()}
                    </p>

                    <Link
                        style={{ width: '100%' }}
                        className='btn btn-primary m-1'
                        to={{
                            pathname: `/collection/${name}`
                        }}
                    >
                        View
                    </Link>

                    <button
                        style={{ width: '100%' }}
                        className='btn btn-danger m-1'
                        onClick={this.deleteCollection}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}

CollectionCard.contextType = GlobalContext;
export default CollectionCard;
