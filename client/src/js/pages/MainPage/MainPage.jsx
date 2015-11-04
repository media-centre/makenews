import React, { Component } from 'react';
import { connect} from 'react-redux';
import Router, {Route, Link} from 'react-router';


export default class MainPage extends Component {
    render() {
        return (
            <div>
                <header>
                    <ul>
                        <li><Link to="/configure">Configure</Link></li>
                        <li><Link to="/surf">Surf</Link></li>
                        <li><Link to="/park">Park</Link></li>
                    </ul>
                </header>
                <section>
                {this.props.children}
                </section>
            </div>
        );
    }
}
function select(store) {
    return store;
}
export default connect(select)(MainPage);


