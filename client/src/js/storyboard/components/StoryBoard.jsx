import { Component } from "react";
import PropTypes from "prop-types";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";
import Locale from "./../../utils/Locale";

export class StoryBoard extends Component {

    componentWillMount() {
        const mainHeaderStrings = Locale.applicationStrings().messages.mainHeaderStrings;
        this.props.dispatch(setCurrentHeaderTab(mainHeaderStrings.storyBoard));
    }

    render() {
        return this.props.children;
    }
}

StoryBoard.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node
};

function select(store) {
    return store;
}
export default connect(select)(StoryBoard);

