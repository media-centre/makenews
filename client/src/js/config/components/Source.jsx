import React, { Component, PropTypes } from "react";
import { addFacebookProfile } from "./../actions/FacebookConfigureActions";

export default class Source extends Component {
    /*this.props.source.picture.data.url*/
    render() {
        return (
            <div className="source">
                <div className="source__icon">
                    <img src={this.props.source.picture.data.url} />
                </div>
                <div className="source__title">
                    { this.props.source.name }
                </div>
                <div className="source__add-icon" onClick={() => this.props.dispatch(addFacebookProfile(this.props.source))}>
                    <img src="./images/add-btn.png"/>
                </div>
            </div>
        );
    }
}

Source.propTypes = {
    "source": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};
