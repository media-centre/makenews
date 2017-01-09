import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { getConfiguredSources, TWITTER, WEB, searchInConfiguredSources } from "../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";

class ConfiguredSources extends Component {
    
    componentDidMount() {
        this.props.dispatch(getConfiguredSources());
        this.props.dispatch(searchInConfiguredSources(""));

    }

    _renderSources(sourceType, searchKey) {
        let configuredSourceDOM = (source) => <li className="source-name" key={source._id}>{source.name}</li>;
        if(searchKey) {
            let key = searchKey.toUpperCase();
            let configuredSources = source => source.name.toUpperCase().match(key) && source;
            return R.pipe(
                R.filter(configuredSources),
                R.map(configuredSourceDOM)
            )(this.props.sources[sourceType]);
        }

        return R.map(configuredSourceDOM, R.prop(sourceType, this.props.sources));
    }

    searchInSources() {
        let value = this.refs.search.value;
        this.props.dispatch(searchInConfiguredSources(value));
    }


    _configuredSourcesGroup(heading, sourceType, searchKey) {
        return (
            <div className="configured-sources__group open">
                <h3 className="configured-sources__group__heading">{heading}</h3>
                <ul className="configured-sources">
                    { this._renderSources(sourceType, searchKey) }
                </ul>
            </div>
        );

    }

    _searchBar() {
        return (
            <div className="search-configured-sources">
                <input placeholder="search" ref="search" onKeyUp={() => {
                    this.searchInSources();
                }}
                />
                <img className="image" src="./images/search-icon.png" alt="search"/>
            </div>);
    }

    _displayConfiguredSources() {
        if(this.props.currentTab === TWITTER) {
            return (
                <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>

                    { this._configuredSourcesGroup("Twitter", "twitter", this.props.searchKeyword) }
                    { this._searchBar() }
                </aside>
            );
        }

        if(this.props.currentTab === WEB) {
            return (
                <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>

                    { this._configuredSourcesGroup("Web", "web", this.props.searchKeyword) }
                    { this._searchBar() }
                </aside>
            );
        }

        return (
            <aside className="configured-sources-container">
                    <h1>{ "My Sources" }</h1>
                    { this._configuredSourcesGroup("Facebook Profiles", "profiles", this.props.searchKeyword) }
                    { this._configuredSourcesGroup("Facebook Pages", "pages", this.props.searchKeyword) }
                    { this._configuredSourcesGroup("Facebook Groups", "groups", this.props.searchKeyword) }
                    { this._searchBar() }

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
