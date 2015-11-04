import { connect} from 'react-redux';
import React, { Component } from 'react';

export class App extends Component {
  render() {
     return (
        <div>
            {this.props.children}
        </div>
      );
  }
}

function select(store) {
  return store;
}
export default connect(select)(App);
