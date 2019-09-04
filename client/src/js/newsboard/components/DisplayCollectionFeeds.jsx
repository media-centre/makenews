import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DisplayArticle from "./DisplayArticle";
import CollectionFeed from "./CollectionFeed";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { WRITE_A_STORY, SCAN_NEWS } from "./../../header/HeaderActions";
import Locale from "./../../utils/Locale";
import { IS_MOBILE } from "./../../utils/Constants";

export class DisplayCollectionFeeds extends Component {

    componentDidMount() {
        this.props.dispatch(displayArticle());
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.collection !== nextProps.collection) {
            this.refs.collection.style.display = "block";
            this.props.dispatch(displayArticle());
        }
    }

    componentWillUnmount() {
        if(this.props.collectionsDOM) {
            this.props.collectionsDOM.style.display = "block";
        }
    }

    displayHeader() {
        return(this.props.tab === WRITE_A_STORY || IS_MOBILE
            ? <header className="collection-header">
                <button className="all-collections" onClick={this.props.isClicked}>
                    <i className="fa fa-arrow-left" aria-hidden="true"/>{this.collectionMessages.allCollections}
                </button>
            </header>
            : <header className="collection-header" />);

    }

    render() {
        this.collectionMessages = Locale.applicationStrings().messages.newsBoard.collection;
        if((this.props.tab === SCAN_NEWS && IS_MOBILE) || (this.props.tab === WRITE_A_STORY && this.props.collectionsDOM)) {
            this.props.collectionsDOM.style.display = "none";
        }

        return (
            <div className={this.props.tab === WRITE_A_STORY ? "collections story-board-collections" : "collections"}>
                <DisplayArticle collectionDOM={this.refs.collection} collectionName={this.props.collection.name} />
                <div ref="collection" className="display-collection">
                    { this.displayHeader() }
                    <div className="collection-feeds">
                        {this.props.feeds.map((feed, index) =>
                            <CollectionFeed collectionId = {this.props.collection.id} feed={feed} key={index} dispatch={this.props.dispatch} tab={this.props.tab}/>)}
                        {!this.props.feeds.length && <div className="default-message">{this.collectionMessages.defaultMessage}</div>}

                    </div>
                </div>
            </div>
        );
    }
}

DisplayCollectionFeeds.propTypes = {
    "collection": PropTypes.object.isRequired,
    "feeds": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "tab": PropTypes.string,
    "isClicked": PropTypes.func,
    "collectionsDOM": PropTypes.object
};

function mapToStore(store) {
    return {
        "feeds": store.displayCollection,
        "collection": store.currentCollection
    };
}
export default connect(mapToStore)(DisplayCollectionFeeds);
