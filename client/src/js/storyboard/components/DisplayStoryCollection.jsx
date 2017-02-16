import React, { Component, PropTypes } from "react";
import { setCollectionName } from "./../../newsboard/actions/DisplayCollectionActions";
import DisplayCollectionFeeds from "./../../newsboard/components/DisplayCollectionFeeds";
import { connect } from "react-redux";

export class DisplayStoryCollection extends Component {
    constructor() {
        super();
        this.state = { "showCollectionFeeds": false };
    }

    displayCollections() {
        return (
            <div className="configured-feeds-container" >
                <div className="select_collection">SELECT A COLLECTION</div>
                <div className="feeds">
                <ul className="configured-sources" ref="collectionList">
                    { this._renderCollections() }
                </ul>
            </div>
            </div>);
    }

    _renderCollections() {
        let [first, ...rest] = this.props.collectionNames;
        let collectionItems = [];
        let getCollectionItem = (collection, className) => {
            return (<li className={className} onClick={(event) => this.collectionClick(event, collection)} key={collection._id}> { collection.collection }</li>);
        };

        if(!first) {
            return collectionItems;
        }
        collectionItems.push(getCollectionItem(first, "collection-name active"));
        rest.map(collection => {
            collectionItems.push(getCollectionItem(collection, "collection-name"));
        });
        return collectionItems;
    }

    collectionClick(event, collection) {
        this.refs.collectionList.querySelector(".collection-name.active").className = "collection-name";
        event.target.className = "collection-name active";
        this.props.dispatch(setCollectionName(collection.collection));
        this.setState({ "showCollectionFeeds": true });
    }

    render() {
        return (
            this.state.showCollectionFeeds ? <DisplayCollectionFeeds /> : this.displayCollections()
        );
    }
}

function mapToStore(store) {
    return {
        "collectionNames": store.fetchedFeeds
    };
}

DisplayStoryCollection.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "collectionNames": PropTypes.array.isRequired
};

export default connect(mapToStore)(DisplayStoryCollection);
