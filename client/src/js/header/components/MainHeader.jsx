import React, { Component, PropTypes } from "react";
import Header from "./Header";
import { connect } from "react-redux";

export class MainHeader extends Component {
    render() {
        return (
            <div>
                <div className = "header">

                    <div className = "header__logo">
                        <img src=".../../../images/makenews-logo.png"/>
                    </div>
                    <div>
                        <Header mainHeaderStrings={this.props.mainHeaderStrings} />
                    </div>
                </div>
                <section>{this.props.children}</section>
            </div>
        );
    }
}

MainHeader.propTypes = {
    "children": PropTypes.node,
    "mainHeaderStrings": PropTypes.object.isRequired
};

function select(store) {
    return { "mainHeaderStrings": store.mainHeaderStrings };
}

export default connect(select)(MainHeader);
