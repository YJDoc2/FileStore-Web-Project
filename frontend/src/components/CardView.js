import React, { Component } from 'react';

import Card from './Card';
import { GlobalContext, Consumer } from './Context';
class CardView extends Component {
    render() {
        return (
            <Consumer>
                {context => (
                    <div className='row m-2'>
                        {context.state.user.files.map(file => (
                            <div
                                key={file.dbfilename}
                                className='col-sm-6 col-md-4 col-lg-4 my-2'
                            >
                                <Card file={file} collection={false} />
                            </div>
                        ))}
                    </div>
                )}
            </Consumer>
        );
    }
}

CardView.contextType = GlobalContext;
export default CardView;
