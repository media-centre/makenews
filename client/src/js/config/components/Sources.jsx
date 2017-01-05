import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";
import { connect } from "react-redux";
import { getSources } from "./../../sourceConfig/actions/SourceConfigurationActions";
import Spinner from "./../../utils/components/Spinner";

export class Sources extends Component {

    componentWillMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        document.addEventListener("scroll", this.getMoreFeeds.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.getMoreFeeds);
    }

    getMoreFeeds() {
        if(this.props.hasMoreSourceResults && !this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1 && this.props.sourceSearchKeyword) { //eslint-disable-line no-magic-numbers
                    this.props.dispatch(getSources(this.props.currentTab, this.props.sourceSearchKeyword, this.props.sources.nextPage, this.props.sources.twitterPreFirstId));
                }
            }, scrollTimeInterval);
        }
    }

    render() {
        const _renderSources = (source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} currentSourceType={this.props.currentTab}/>;

        return (
            <div className="source-results">

                { this.props.sources.data.length &&
                    R.addIndex(R.map)(_renderSources, this.props.sources.data) || "" }

                { !this.props.sources.data.length && !this.props.sources.isFetchingSources &&
                    <p>{"Enter a keyword in the input box to get some sources"}</p>
                }

                { this.props.sources.isFetchingSources &&
                    <Spinner /> }
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "sources": store.sourceResults,
        "currentTab": store.currentSourceTab,
        "hasMoreSourceResults": store.hasMoreSourceResults,
        "sourceSearchKeyword": store.sourceSearchKeyword
    };
}

Sources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired,
    "hasMoreSourceResults": PropTypes.bool.isRequired,
    "sourceSearchKeyword": PropTypes.string.isRequired
};

export default connect(mapToStore)(Sources);
