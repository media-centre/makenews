import React, { Component } from 'react';
import { connect} from 'react-redux';


export default class ConfigurePage extends Component {
    render() {
        return (
            <div>Configure</div>

        );
    }
}
function select(store) {
    return store;
}
export default connect(select)(ConfigurePage);
