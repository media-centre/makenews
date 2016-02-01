"use strict";
import React, { Component, PropTypes } from "react";

export default class App extends Component {
  render() {
      return (
        <div>
            {this.props.children}
        </div>
      );
  }

}

App.displayName = "App";
App.propTypes = {
    "children": PropTypes.node.isRequired
};

