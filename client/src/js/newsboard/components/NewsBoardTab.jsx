/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { connect } from "react-redux";

export class NewsBoardTab extends Component {

    displayFeeds(sourceType) {
        this.props.dispatch(newsBoardTabSwitch(sourceType));
    }

    render() {
        return (<div>
            <div className="news-board-tab" >
                <img className="news-board-tab-image" src={`./../../images/${this.props.image}`} onClick={() => { this.displayFeeds(this.props.sourceType); }} />
            </div>
        </div>);
    }
}

function mapToStore(store) {
    return { store };
}

NewsBoardTab.propTypes = {
    "image": PropTypes.string.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(NewsBoardTab);
