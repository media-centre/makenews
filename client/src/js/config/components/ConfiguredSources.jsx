import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { getConfiguredSources } from "../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";

export class ConfiguredSources extends Component {
    
    componentDidMount() {
        this.props.dispatch(getConfiguredSources());
    }

    _renderSources(sourceType) {
        let sourceCategory = (source, index) => {
            return <li key={index}>{source.name}</li>;
        };

        return R.addIndex(R.map)(sourceCategory, R.prop(sourceType, this.props.sources));
    }

    render() {
        return (
            <aside className="configured-sources-container">
                <h1>{ "My Sources" }</h1>
                <div className="configured-sources__group open">
                    <h3 className="configured-sources__group__heading">{ "Facebook Friends" }</h3>
                    <ul className="configured-sources">
                        { this._renderSources("profiles") }
                    </ul>
                </div>
                <div className="configured-sources__group">
                    <h3 className="configured-sources__group__heading">{ "Facebook Pages" }</h3>
                    <ul className="configured-sources">
                        { this._renderSources("pages") }
                    </ul>
                </div>
                <div className="configured-sources__group">
                    <h3 className="configured-sources__group__heading">{ "Facebook Groups" }</h3>
                    <ul className="configured-sources">
                        { this._renderSources("groups") }
                    </ul>
                </div>
            </aside>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.configuredSources
    };
}

ConfiguredSources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(ConfiguredSources);
