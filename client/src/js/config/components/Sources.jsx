import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";
import { connect } from "react-redux";
import { getSources, deleteSourceStatus } from "./../../sourceConfig/actions/SourceConfigurationActions";
import Spinner from "./../../utils/components/Spinner";
import Toast from "../../utils/custom_templates/Toast";

export class Sources extends Component {

    constructor() {
        super();
        this.getMoreFeeds = this._getMoreFeeds.bind(this);
    }

    componentWillMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        document.addEventListener("scroll", this.getMoreFeeds);
    }

    componentDidUpdate(prevProps) {
        if(this.props.sources.keyword && !this.props.sources.isFetchingSources) {
            if(this.props.hasMoreSourceResults && document.body.scrollHeight <= window.innerHeight) {
                this.props.dispatch(
                    getSources(this.props.currentTab, this.props.sources.keyword,
                        this.props.sources.nextPage, this.props.sources.twitterPreFirstId)
                );
            }
        }
        if(this.props.deleteSourceStatus !== prevProps.deleteSourceStatus) {
            this.props.dispatch(deleteSourceStatus(""));
        }
    }
    
    componentWillUnmount() {
        document.removeEventListener("scroll", this.getMoreFeeds);
    }

    _getMoreFeeds() {
        if(this.props.hasMoreSourceResults && !this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
                    this.props.dispatch(getSources(this.props.currentTab, this.props.sources.keyword, this.props.sources.nextPage, this.props.sources.twitterPreFirstId));
                }
            }, scrollTimeInterval);
        }
    }

    render() {
        const _renderSources = (source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} currentSourceType={this.props.currentTab}/>;

        let message = this.props.sources.keyword ? <p>{"No results found. Please enter another keyword"}</p>
            : <p>{"Enter a keyword in the input box to get some sources"}</p>;

        return (
            <div className="source-results">

                { this.props.sources.data.length &&
                    R.addIndex(R.map)(_renderSources, this.props.sources.data) || "" }

                { !this.props.sources.data.length && !this.props.sources.isFetchingSources &&
                    message
                }

                { this.props.sources.isFetchingSources &&
                    <Spinner /> }
                { this.props.deleteSourceStatus && Toast.show(this.props.deleteSourceStatus) }
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "sources": store.sourceResults,
        "currentTab": store.currentSourceTab,
        "hasMoreSourceResults": store.hasMoreSourceResults,
        "deleteSourceStatus": store.deleteSourceStatus
    };
}

Sources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired,
    "hasMoreSourceResults": PropTypes.bool.isRequired,
    "deleteSourceStatus": PropTypes.string
};

export default connect(mapToStore)(Sources);
