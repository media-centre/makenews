import React, { Component } from 'react';
import { connect} from 'react-redux';


export default class ParkPage extends Component {
    render() {
        return (
            <div>Park</div>

        );
    }
}
function select(store) {
    return store;
}
export default connect(select)(ParkPage);
