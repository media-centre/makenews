import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { getConfiguredSources, TWITTER, WEB } from "../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";

export class ConfiguredSources extends Component {
    
    componentDidMount() {
        this.props.dispatch(getConfiguredSources());
    }

    _renderSources(sourceType) {
        let sourceCategory = (source, index) => {
            return <li className="source-name" key={index}>{source.name}</li>;
        };

        return R.addIndex(R.map)(sourceCategory, R.prop(sourceType, this.props.sources));
    }

    _configuredSourcesGroup(heading, sourceType) {
        return (
            <div className="configured-sources__group open">
                <h3 className="configured-sources__group__heading">{heading}</h3>
                <ul className="configured-sources">
                    { this._renderSources(sourceType) }
                </ul>
            </div>
        );
    }

    _displayConfiguredSources() {
        if(this.props.currentTab === TWITTER) {
            return (
                <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>
                    { this._configuredSourcesGroup("Twitter", "twitter") }
                </aside>
            );
        }

        if(this.props.currentTab === WEB) {
            return (
                <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>
                    { this._configuredSourcesGroup("Web", "web") }
                </aside>
            );
        }

        return (
            <aside className="configured-sources-container">
                <h1>{ "My Sources" }</h1>
                { this._configuredSourcesGroup("Facebook Profiles", "profiles") }
                { this._configuredSourcesGroup("Facebook Pages", "pages") }
                { this._configuredSourcesGroup("Facebook Groups", "groups") }
            </aside>
        );
    }

    render() {
        return this._displayConfiguredSources();
    }
}

function mapToStore(state) {
    return {
        "sources": state.configuredSources,
        "currentTab": state.currentSourceTab
    };
}

ConfiguredSources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired
};

export default connect(mapToStore)(ConfiguredSources);
