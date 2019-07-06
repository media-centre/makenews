import React, { Component } from "react";
import PropTypes from "prop-types";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";
import Locale from "./../../utils/Locale";

export class Portfolio extends Component {

    componentWillMount() {
        const mainHeaderStrings = Locale.applicationStrings().messages.mainHeaderStrings;
        this.props.dispatch(setCurrentHeaderTab(mainHeaderStrings.portfolio));
    }

    render() {
        return (<div className="portfolio">
                <img className="portfolioImage" src="./images/portfolioImage.png" />
            </div>
        );
    }
}

Portfolio.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node
};

function select(store) {
    return store;
}
export default connect(select)(Portfolio);

