import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";
import { connect } from "react-redux";
import { getSourcesOf } from "./../actions/FacebookConfigureActions";

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
                if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
                    /* TODO: store the search box query in redux-store. so you can use q= , rather than relying on the response from the server*/ // eslint-disable-line
                    this.props.dispatch(getSourcesOf(this.props.currentTab, "moana", this.props.sources.nextPage));
                }
            }, scrollTimeInterval);
        }
    }

    render() {
        return (
            <div className="source-results">
                { R.addIndex(R.map)(
                    (source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} currentSourceType={this.props.currentTab}/>,
                    this.props.sources.data
                ) }
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "sources": store.facebookSources,
        "currentTab": store.facebookCurrentSourceTab,
        "hasMoreSourceResults": store.hasMoreSourceResults
    };
}

Sources.propTypes = {
    "sources": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired,
    "hasMoreSourceResults": PropTypes.bool.isRequired
};

export default connect(mapToStore)(Sources);
