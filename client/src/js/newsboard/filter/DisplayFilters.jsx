import React, { Component } from "react";
import PropTypes from "prop-types";
import R from "ramda"; //eslint-disable-line id-length
import { connect } from "react-redux";
import { filteredSources, filterTabSwitch } from "./FilterActions";
import { searchInConfiguredSources, addSourceToConfigureList } from "../../sourceConfig/actions/SourceConfigurationActions";
import ConfiguredSources from "./ConfiguredSources";
import Input from "./../../utils/components/Input";
import Toast from "../../utils/custom_templates/Toast";
import Locale from "./../../utils/Locale";

const sourceTypes = { "web": "web", "twitter": "twitter", "profiles": "facebook", "pages": "facebook", "groups": "facebook" };

let selectedSources = { "web": new Set(), "facebook": new Set(), "twitter": new Set() };
export class DisplayFilters extends Component {
    constructor() {
        super();
        this.state = { "hashtagInputBox": false };
        this._renderSources = this._renderSources.bind(this);
        this.hashtags = [];
        this.searchInSources = this.searchInSources.bind(this);
        this.showInputBox = this.showInputBox.bind(this);
        this.cancelFilter = this.cancelFilter.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.addHashTag = this.addHashTag.bind(this);
    }

    componentWillMount() {
        this.initSelectedSources();
    }

    componentDidMount() {
        this.props.dispatch(searchInConfiguredSources(""));
        this.hashtags = this.props.sources.twitter.map((source) => source.name);
    }

    componentWillUnmount() {
        this.initSelectedSources();
    }

    initSelectedSources() {
        const { web, facebook, twitter } = this.props.currentFilterSource;
        selectedSources = { "web": new Set(web), "facebook": new Set(facebook), "twitter": new Set(twitter) };
    }

    selectAllSources() {
        selectedSources = { "web": new Set(), "facebook": new Set(), "twitter": new Set() };
        Object.entries(this.props.sources).map(([key, value]) => {
            value.forEach(elem => {
                selectedSources[key].add(elem.url);
            });
        });
    }

    _renderSources(sourceType, searchKey) {
        const configuredSourceDOM = (source) =>
            (<li className="filter-source" key={source._id}>
                <input type="checkbox" role="checkbox" name={sourceType} title={source.name} value={source._id}
                    onClick={this.sourceClick} defaultChecked={this.hasChecked(source._id, sourceType)}
                />
                <span className="source__title">{source.name}</span>
            </li>);
        if(searchKey) {
            const key = searchKey.toUpperCase();
            const configuredSources = source => source && source.name && source.name.toUpperCase().match(key);
            return R.pipe(
                R.filter(configuredSources),
                R.map(configuredSourceDOM)
            )(this.props.sources[sourceType]);
        }
        return R.map(configuredSourceDOM, R.prop(sourceType, this.props.sources));
    }

    hasChecked(id, sourceType) {
        const tempId = (sourceType === sourceTypes.twitter && id.startsWith("#")) ? encodeURIComponent(id) : id;
        return selectedSources[sourceTypes[sourceType]].has(tempId);
    }

    sourceClick(eventObj) {
        const { name, value } = eventObj.target;
        if(selectedSources[sourceTypes[name]].has(value)) {
            selectedSources[sourceTypes[name]].delete(value);
        } else {
            selectedSources[sourceTypes[name]].add(value);
        }
    }

    searchInSources() {
        const value = this.refs.filterSearch.refs.input.value;
        this.props.dispatch(searchInConfiguredSources(value));
    }

    applyFilter() {
        const sourceFilters = {};
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

    addHashTag() {
        let hashtag = this.refs.hashtagInput.refs.input.value;
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
                selectedSources.twitter.add(encodeURIComponent(hashtag));
                this.props.dispatch(addSourceToConfigureList(this.props.currentTab, sourceDoc));
            } else {
                Toast.show(this.filterStrings.hashTag.alreadyExist);
            }
        } else {
            Toast.show(this.filterStrings.hashTag.emptyHashTag);
        }
    }

    showInputBox() {
        this.setState({ "hashtagInputBox": !this.state.hashtagInputBox });
    }

    render() {
        this.filterStrings = Locale.applicationStrings().messages.newsBoard.filters;
        return (
            <aside ref="sources" className="filters-container">
                <Input className={"input-box"} ref="filterSearch" callback={this.searchInSources}
                    placeholder="search" addonSrc="search"
                />
                { this.props.currentTab === "twitter" &&
                    <div className="hashtag-container">
                        <div className="add-hashtag" onClick={this.showInputBox}>
                            <i className="fa fa-plus-circle" />
                            <span>{this.filterStrings.addHashTags}</span>
                        </div>
                        { this.state.hashtagInputBox &&
                        <div className="hashtag-box">
                            <span className="hash">#</span>
                            <Input ref="hashtagInput" placeholder="Add Hashtag"
                                className={"input-hashtag-box show"}
                                callback={this.addHashTag}
                                callbackOnEnter
                                autoFocus
                            />
                            <div className="add-tag" onClick={this.addHashTag} >{this.filterStrings.addTag}</div>
                        </div> }
                    </div>
                }

                <ConfiguredSources searchKeyword={this.props.searchKeyword} currentTab={this.props.currentTab} renderSources={this._renderSources}
                    selectAllSources={this.selectAllSources()}
                />

                <div className="controls">
                    <button id="cancelBtn" className="cancel-btn primary" onClick={this.cancelFilter}>{this.filterStrings.cancelButton}</button>
                    <button id="applyBtn" className="apply-btn primary" onClick={this.applyFilter}>{this.filterStrings.applyButton}</button>
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
