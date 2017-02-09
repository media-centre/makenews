import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import { connect } from "react-redux";
import { filteredSources, filterTabSwitch } from "./FilterActions";
import { Sources } from "../../config/components/ConfiguredSources";
const sourceTypes = { "web": "web", "twitter": "twitter", "profiles": "facebook", "pages": "facebook", "groups": "facebook"};
let selectedSources = {};
class DisplayFilters extends Component {
    constructor() {
        super();
        this.sourcesObject = new Sources(this);
    }

    componentDidMount() {
        this.sourcesObject.init();
        let { web, facebook, twitter } = this.props.currentFilterSource;
        selectedSources = { "web": new Set(web), "facebook": new Set(facebook), "twitter": new Set(twitter) };
    }

    _renderSources(sourceType, searchKey) {
        let configuredSourceDOM = (source) => <li className="source-name" key={source._id}>
            <input type="checkbox" name={sourceType} value={source._id} onClick={this.sourceClick} defaultChecked={this.hasChecked(source._id, sourceType)} />{source.name}
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
        return selectedSources[sourceTypes[sourceType]].has(id);
    }
    sourceClick(eventObj) {
        let { name, value } = eventObj.target;
        if(selectedSources[sourceTypes[name]].has(value)) {
            selectedSources[sourceTypes[name]].delete(value);
        } else {
            selectedSources[sourceTypes[name]].add(value);
        }
    }

    applyFilter() {
        let sourceFilters = {};
        sourceFilters.web = [...selectedSources.web];
        sourceFilters.facebook = [...selectedSources.facebook];
        sourceFilters.twitter = [...selectedSources.twitter];
        Sources.twitter = R.pipe(R.filter(src => src.checked), R.map(src => src._id))(this.props.sources.twitter);
        this.props.dispatch(filteredSources(sourceFilters));
        this.props.dispatch(filterTabSwitch(""));
    }

    cancelFilter() {
        this.props.dispatch(filterTabSwitch(""));
    }

    render() {
        return (
            <aside ref="sources" className="configured-sources-container">
                { this.sourcesObject.displayConfiguredSources() }
                <button id="cancelBtn" onClick={() => this.cancelFilter()}>Cancel</button>
                <button id="applyBtn" onClick={() =>this.applyFilter()}>Apply</button>
                { this.sourcesObject.searchBar() }
            </aside>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.configuredSources,
        "searchKeyword": state.searchInConfiguredSources,
        "currentTab": state.currentFilter,
        "currentFilterSource": state.currentFilterSource
    };
}

DisplayFilters.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "searchKeyword": PropTypes.string,
    "currentTab": PropTypes.string.isRequired,
    "callback": PropTypes.func,
    "currentFilterSource": PropTypes.object
};


export default connect(mapToStore)(DisplayFilters);
