import React, { Component, PropTypes } from "react";
import ConfiguredSources from "./ConfiguredSources";
import ConfigurePane from "./ConfigurePane";
import * as SourceConfigActions from "./../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";
import { PAGES, PROFILES, GROUPS } from "./../actions/FacebookConfigureActions";

export class ConfigureSourcesPage extends Component {

    componentDidMount() {
        this.sourceTab(this.props.params, this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        this.sourceTab(nextProps.params, nextProps.dispatch);
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.params.sourceType !== this.props.params.sourceType);
    }

    sourceTab(params, dispatch) {
        switch (params.sourceType) {
        case "twitter": {
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.TWITTER));
            break;
        }
        case "facebook": {
            if(params.sourceSubType === "groups") {
                dispatch(SourceConfigActions.switchSourceTab(GROUPS));
            } else if(params.sourceSubType === "pages") {
                dispatch(SourceConfigActions.switchSourceTab(PAGES));
            } else {
                dispatch(SourceConfigActions.switchSourceTab(PROFILES));
            }
            break;
        }
        case "web":
        default: {
            dispatch(SourceConfigActions.switchSourceTab(SourceConfigActions.WEB));
        }
        }
    }

    render() {
        return (
            <div className="configure-container">
                <ConfiguredSources />
                <ConfigurePane />
            </div>
        );
    }
}

ConfigureSourcesPage.propTypes = {
    "params": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};

let mapToStore = (store) => ({
    "currentSourceTab": store.currentSourceTab
});

export default connect(mapToStore)(ConfigureSourcesPage);
