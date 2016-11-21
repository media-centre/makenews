import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import { connect } from "react-redux";

class FacebookConfigure extends Component {
    render() {
        return (
            <div className="configure-container">
                <ConfiguredSources sources = {this.props.sources} />
                <ConfigurePane />
            </div>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.facebookConfiguredUrls
    };
}

FacebookConfigure.propTypes = {
    "sources": PropTypes.object.isRequired
};

export default connect(mapToStore)(FacebookConfigure);
