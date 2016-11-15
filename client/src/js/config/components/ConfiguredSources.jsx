import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length

export default class ConfiguredSources extends Component {

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
                <h3>{ "Facebook Friends" }</h3>
                <ul className="configured-sources">
                    { this._renderSources("friends") }
                </ul>
                <h3>{ "Facebook Pages" }</h3>
                <ul className="configured-sources">
                    { this._renderSources("pages") }
                </ul>
                <h3>{ "Facebook Groups" }</h3>
                <ul className="configured-sources">
                    { this._renderSources("groups") }
                </ul>
            </aside>
        );
    }
}

ConfiguredSources.propTypes = {
    "sources": PropTypes.object.isRequired
};
