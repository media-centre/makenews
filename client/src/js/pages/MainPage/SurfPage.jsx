import React, { Component } from 'react';
import { connect} from 'react-redux';


export default class SurfPage extends Component {
    render() {
        return (
            <div>Surf</div>

        );
    }
}
function select(store) {
    return store;
}
export default connect(select)(SurfPage);
