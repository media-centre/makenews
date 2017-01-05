import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { getConfiguredSources, TWITTER, WEB, searchInConfiguredSources } from "../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";

class ConfiguredSources extends Component {
    
    componentDidMount() {
        this.props.dispatch(getConfiguredSources());
        this.props.dispatch(searchInConfiguredSources(""));

    }

    _renderSources(sourceType) {
        let sourceCategory = (source, index) => {
            return <li className="source-name" key={index}>{source.name}</li>;
        };

        return R.addIndex(R.map)(sourceCategory, R.prop(sourceType, this.props.sources));
    }

    _searchInRenderedSources(sourceType, searchkey) {
        let sourceCategory = (source, index) => {
            return <li className="source-name" key={index}>{source}</li>;
        };
        let matchedArray = [];
        let matchedSources = (source) => {
            if (source.name.toUpperCase().match(searchkey.toUpperCase()) !== null) {
                matchedArray.push(source.name);
            }
        };
        R.forEach(matchedSources, R.prop(sourceType, this.props.sources));
        return R.addIndex(R.map)(sourceCategory, matchedArray);
    }

    searchInSources() {
        let value = this.refs.search.value;
        this.props.dispatch(searchInConfiguredSources(value));
    }


    _configuredSourcesGroup(heading, sourceType, searchkey) {
        if(searchkey) {
            return (
                <div className="configured-sources__group open">
                    <h3 className="configured-sources__group__heading">{heading}</h3>
                    <ul className="configured-sources">
                        { this._searchInRenderedSources(sourceType, searchkey) }

                    </ul>
                </div>
            );
        }
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
                    { this._configuredSourcesGroup("Twitter", "twitter", this.props.searchKeyword) }
                    <input placeholder="search" className="search-configured-sources" ref="search" onChange={() => {
                        this.searchInSources(event);
                    }}
                    />
                </aside>
            );
        }

        if(this.props.currentTab === WEB) {
            return (
                <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>
                    { this._configuredSourcesGroup("Web", "web", this.props.searchKeyword) }
                    <input placeholder="search" className="search-configured-sources" ref="search" onChange={() => {
                        this.searchInSources(event);
                    }}
                    />
                </aside>
            );
        }

        return (
            <aside className="configured-sources-container">
                <h1>{ "My Sources" }</h1>
                { this._configuredSourcesGroup("Facebook Profiles", "profiles", this.props.searchKeyword) }
                { this._configuredSourcesGroup("Facebook Pages", "pages", this.props.searchKeyword) }
                { this._configuredSourcesGroup("Facebook Groups", "groups", this.props.searchKeyword) }
                <input placeholder="search" className="search-configured-sources" ref="search" onChange={() => {
                    this.searchInSources(event);
                }}
                />

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
        "searchKeyword": state.searchInConfiguredSources,
        "currentTab": state.currentSourceTab
    };
}

ConfiguredSources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "searchKeyword": PropTypes.string,
    "currentTab": PropTypes.string.isRequired
};

export default connect(mapToStore)(ConfiguredSources);
