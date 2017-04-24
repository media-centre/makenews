import React, { Component } from "react";
import PropTypes from "prop-types";
import R from "ramda"; //eslint-disable-line id-length
import { connect } from "react-redux";
import { filteredSources, filterTabSwitch } from "./FilterActions";
import { getConfiguredSources, searchInConfiguredSources, addSourceToConfigureList } from "../../sourceConfig/actions/SourceConfigurationActions";
import SourceFilters from "./SourceFilters";
import Input from "./../../utils/components/Input";
import Toast from "../../utils/custom_templates/Toast";

const sourceTypes = { "web": "web", "twitter": "twitter", "profiles": "facebook", "pages": "facebook", "groups": "facebook" };

let selectedSources = { "web": new Set(), "facebook": new Set(), "twitter": new Set() };
export class DisplayFilters extends Component {
    constructor() {
        super();
        this.state = { "hashtagInputBox": false };
        this._renderSources = this._renderSources.bind(this);
        this.hashtags = [];
    }

    componentDidMount() {
        this.props.dispatch(getConfiguredSources());
        this.props.dispatch(searchInConfiguredSources(""));
        this.hashtags = this.props.sources.twitter.map((source) => source.name);
        this.initSelectedSources();
    }

    initSelectedSources() {
        let { web, facebook, twitter } = this.props.currentFilterSource;
        selectedSources = { "web": new Set(web), "facebook": new Set(facebook), "twitter": new Set(twitter) };
    }

    _renderSources(sourceType, searchKey) {
        let configuredSourceDOM = (source) =>
            <li className="filter-source" key={source._id}>
                <input type="checkbox" role="checkbox" name={sourceType} title={source.name} value={source._id}
                    onClick={this.sourceClick} defaultChecked={this.hasChecked(source._id, sourceType)}
                />
                <span className="source__title">{source.name}</span>
            </li>;
        if(searchKey) {
            let key = searchKey.toUpperCase();
            let configuredSources = source => source && source.name && source.name.toUpperCase().match(key);
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

    searchInSources(event) {
        let value = event.target.value;
        this.props.dispatch(searchInConfiguredSources(value));
    }

    applyFilter() {
        let sourceFilters = {};
        sourceFilters.web = [...selectedSources.web];
        sourceFilters.facebook = [...selectedSources.facebook];
        sourceFilters.twitter = [...selectedSources.twitter].map((source) => {
            if(source.startsWith("#")) {
                return encodeURIComponent(source);
            }
            return source;
        });

        this.props.dispatch(filteredSources(sourceFilters));
        this.props.dispatch(filterTabSwitch(""));
    }

    cancelFilter() {
        this.initSelectedSources();
        this.props.dispatch(filterTabSwitch(""));
    }

    onEnterKeyPressed(event) {
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            let hashtag = event.target.value;
            this.addHashtag(hashtag);
        }
    }

    addHashtag(hashtag) {
        if(hashtag && hashtag !== "#") {
            if (!hashtag.startsWith("#")) {
                hashtag = "#" + hashtag; //eslint-disable-line no-param-reassign
            }

            if(this.hashtags.indexOf(hashtag) < 0) { //eslint-disable-line no-magic-numbers
                this.hashtags.push(hashtag);
                const sourceDoc = {
                    "id": hashtag,
                    "name": hashtag,
                    "hashtag": true
                };
                selectedSources.twitter.add(hashtag);
                this.props.dispatch(addSourceToConfigureList(this.props.currentTab, sourceDoc));
            } else {
                Toast.show("Hashtag already exists");
            }
        } else {
            Toast.show("Hashtag cannot be Empty");
        }
    }

    render() {
        let hashtagValue = "";
        return (
            <aside ref="sources" className="filters-container">
                <Input className={"input-box"} eventHandlers={{ "onKeyUp": (event) => { //eslint-disable-line react/jsx-boolean-value
                    this.searchInSources(event);
                } }} placeholder="search" addonSrc="./images/search-icon.png"
                />

                { this.props.currentTab === "twitter" &&
                    <div className="hashtag-container">
                       <div className="add-hashtag" onClick={() => this.setState({ "hashtagInputBox": !this.state.hashtagInputBox })}>
                           <i className="fa fa-plus-circle" />
                           <span> ADD HASHTAG </span>
                       </div>
                        { this.state.hashtagInputBox &&
                        <div className="hashtag-box">
                            <span className="hash">#</span>
                            <Input placeholder="Add Hashtag" className={"input-hashtag-box show"} eventHandlers={{ "onKeyUp": (event) => {
                                hashtagValue = event.target.value;
                                this.onEnterKeyPressed(event);
                            } }}
                            />
                            <div className="add-tag" onClick={() => this.addHashtag(hashtagValue)} >ADD TAG</div>
                        </div> }
                    </div>
                }

                <SourceFilters searchKeyword={this.props.searchKeyword} currentTab={this.props.currentTab} renderSources={this._renderSources}/>

                <div className="controls">
                    <button id="cancelBtn" className="cancel-btn secondary" onClick={() => this.cancelFilter()}>Cancel</button>
                    <button id="applyBtn" className="apply-btn primary" onClick={() => this.applyFilter()}>Apply</button>
                </div>
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
