import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { getConfiguredSources, TWITTER, WEB, searchInConfiguredSources } from "../../sourceConfig/actions/SourceConfigurationActions";
import { connect } from "react-redux";
import { filteredSources, filterTabSwitch } from "./FilterActions";
import Input from "./../../utils/components/Input";
const sourceTypes = { "web": "web", "twitter": "twitter", "profiles": "facebook", "pages": "facebook", "groups": "facebook"};
class DisplayFilters extends Component {

    async componentDidMount() {
        this.sourceClick = this.sourceClick.bind(this);
        this.hasChecked = this.hasChecked.bind(this);
        this.props.dispatch(getConfiguredSources());
        this.props.dispatch(searchInConfiguredSources(""));
    }

    _renderSources(sourceType, searchKey) {
        let { web, facebook, twitter } = this.props.currentFilterSource;
        this.selectedSources = { "web": new Set(web), "facebook": new Set(facebook), "twitter": new Set(twitter) };
        let configuredSourceDOM = (source) => <li className="source-name" key={source._id}>
            <input type="checkbox" name={sourceType} value={source._id} onClick={this.sourceClick}
                   defaultChecked={this.hasChecked(source._id, sourceType)} />{source.name}
        </li>;
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

    hasChecked(id, sourceType) {
        return this.selectedSources[sourceTypes[sourceType]].has(id);
    }
    sourceClick(eventObj) {
        let { name, value } = eventObj.target;
        if(eventObj.target.checked) {
            this.selectedSources[sourceTypes[name]].add(value);
        } else {
            this.selectedSources[sourceTypes[name]].delete(value);
        }
    }

    applyFilter() {
        let sourceFilters = {};
        sourceFilters.web = [...this.selectedSources.web];
        sourceFilters.facebook = [...this.selectedSources.facebook];
        sourceFilters.twitter = [...this.selectedSources.twitter];
        //this.selectedSources.web = R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.web);
        //let facebookSources = [];
        //facebookSources.push(...R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.profiles));
        //facebookSources.push(...R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.pages));
        //facebookSources.push(...R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.groups));
        //this.selectedSources.facebook = facebookSources;
        //this.selectedSources.twitter = R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.twitter);
        this.props.dispatch(filteredSources(sourceFilters));
        this.props.dispatch(filterTabSwitch(""));
    }

    searchInSources(event) {
        let value = event.target.value;
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
        //eslint-disable-next-line brace-style
        return <Input eventHandlers={{ "onKeyUp": (event) => { this.searchInSources(event); } }} placeholder="search" addonSrc="./images/search-icon.png"/>;
    }

    _displayConfiguredSources() {
        if(this.props.currentFilter === TWITTER) {
            return (
                <div className="configured-sources-block">
                    { this._configuredSourcesGroup("Twitter", "twitter", this.props.searchKeyword) }
                </div>
            );
        }

        if(this.props.currentFilter === WEB) {
            return (
                <div className="configured-sources-block">
                    { this._configuredSourcesGroup("Web", "web", this.props.searchKeyword) }
                </div>
            );
        }

        return (
            <div className="configured-sources-block">
                { this._configuredSourcesGroup("Facebook Profiles", "profiles", this.props.searchKeyword) }
                { this._configuredSourcesGroup("Facebook Pages", "pages", this.props.searchKeyword) }
                { this._configuredSourcesGroup("Facebook Groups", "groups", this.props.searchKeyword) }
            </div>
        );
    }

    cancelFilter() {
        this.props.dispatch(filterTabSwitch(""));
    }

    render() {
        return (
            <aside ref="sources" className="configured-sources-container">
                { this._displayConfiguredSources() }
                <button id="cancelBtn" onClick={() => this.cancelFilter()}>Cancel</button>
                <button id="applyBtn" onClick={() =>this.applyFilter()}>Apply</button>
                { this._searchBar() }
            </aside>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.configuredSources,
        "searchKeyword": state.searchInConfiguredSources,
        "currentFilter": state.currentFilter,
        "currentFilterSource": state.currentFilterSource
    };
}

DisplayFilters.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "searchKeyword": PropTypes.string,
    "currentFilter": PropTypes.string.isRequired,
    "callback": PropTypes.func,
    "currentFilterSource": PropTypes.object
};

export default connect(mapToStore)(DisplayFilters);
