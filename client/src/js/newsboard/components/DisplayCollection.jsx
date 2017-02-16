import React, { Component, PropTypes } from "react";
import { setCollectionName } from "./../actions/DisplayCollectionActions";
import { addToCollection } from "../actions/DisplayArticleActions";
import StringUtil from "./../../../../../common/src/util/StringUtil";
import { connect } from "react-redux";
import Input from "./../../utils/components/Input";
import R from "ramda"; //eslint-disable-line id-length

export class DisplayCollection extends Component {
    constructor() {
        super();
        this.state = { "showCollectionPopup": false, "searchKey": "" };
    }

    componentWillReceiveProps(nextProps) {
        let [firstCollection] = nextProps.feeds;
        if(firstCollection) {
            let collectionName = firstCollection.collection;
            this.props.dispatch(setCollectionName(collectionName));
        }
    }


    collectionClick(event, collection) {
        this.refs.collectionList.querySelector(".collection-name.active").className = "collection-name";
        event.target.className = "collection-name active";
        this.props.dispatch(setCollectionName(collection.collection));
        if(this.props.addArticleToCollection.id) {
            this.props.dispatch(addToCollection(collection.collection, this.props.addArticleToCollection));
        }
    }
    _renderCollections() {
        const searchKey = this.state.searchKey;
        let filteredCollections = [];
        if(searchKey) {
            const key = searchKey.toUpperCase();
            const matchCollectionName = source => source.collection.toUpperCase().match(key) && source;

            filteredCollections = R.filter(matchCollectionName, this.props.feeds);
        } else {
            filteredCollections = this.props.feeds;
        }

        let [first, ...rest] = filteredCollections;
        let collectionItems = [];
        const getCollectionItem = (collection, className) =>
            (<li className={className} onClick={(event) => this.collectionClick(event, collection)} key={collection._id}> { collection.collection }</li>);

        if(!first) {
            return collectionItems;
        }
        collectionItems.push(getCollectionItem(first, "collection-name active"));
        rest.forEach(collection => {
            collectionItems.push(getCollectionItem(collection, "collection-name"));
        });
        return collectionItems;
    }

    _searchCollections(event) {
        this.setState({ "searchKey": event.target.value });
    }

    createCollection(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.props.dispatch(addToCollection(this.refs.collectionName.value, this.props.addArticleToCollection, true));
            this.setState({ "showCollectionPopup": false });
        }
    }

    showPopup() {
        return (
            <div className="collection-popup-overlay">
                {this.state.showCollectionPopup &&
                    <div className="new-collection">
                        <input type="text" className="new-collection-input-box" ref="collectionName"
                            placeholder="create new collection" onKeyUp={(event) => {
                                this.createCollection(event);
                            }}
                        />

                        <button className="cancel-collection" onClick={() => {
                            this.setState({ "showCollectionPopup": false });
                        }}
                        >CANCEL
                        </button>

                        <button className="save-collection" onClick={() => {
                            if (!StringUtil.isEmptyString(this.refs.collectionName.value)) {
                                this.props.dispatch(addToCollection(this.refs.collectionName.value, this.props.addArticleToCollection, true));
                            }
                            this.setState({ "showCollectionPopup": false });
                        }}
                        >SAVE
                        </button>
                    </div>
                }
            </div>
        );
    }

    render() {
        return (
            <div className="collection-list-container" >
                <div className="search-bar">
                    <Input placeholder="Search collections" eventHandlers={{ "onKeyUp": (event) => {
                        this._searchCollections(event);
                    } }} addonSrc="./images/search-icon.png"
                    />
                </div>
                <div className="create_collection" onClick={() => {
                    this.setState({ "showCollectionPopup": true });
                }}
                >
                    <i className="fa fa-plus-circle"/> Create new collection
                </div>

                { this.state.showCollectionPopup ? this.showPopup() : null}
                <div className="feeds">
                    <ul className="configured-sources" ref="collectionList">
                        { this._renderCollections() }
                    </ul>
                </div>
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds,
        "addArticleToCollection": store.addArticleToCollection
    };
}

DisplayCollection.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "addArticleToCollection": PropTypes.object
};

export default connect(mapToStore)(DisplayCollection);
