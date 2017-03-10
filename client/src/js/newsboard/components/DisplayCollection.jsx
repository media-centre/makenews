import React, { Component, PropTypes } from "react";
import { setCurrentCollection, deleteCollection } from "./../actions/DisplayCollectionActions";
import { addToCollection } from "../actions/DisplayArticleActions";
import StringUtil from "./../../../../../common/src/util/StringUtil";
import { connect } from "react-redux";
import Input from "./../../utils/components/Input";
import R from "ramda"; //eslint-disable-line id-length
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import DisplayCollectionFeeds from "./DisplayCollectionFeeds";

export class DisplayCollection extends Component {
    constructor() {
        super();
        this.state = { "showCollectionPopup": false, "searchKey": "", "isClicked": false };
    }

    componentWillReceiveProps(nextProps) {
        const [firstCollection] = nextProps.feeds;
        if(firstCollection) {
            this.props.dispatch(setCurrentCollection(firstCollection));
        }
    }


    collectionClick(event, collection) {
        this.setState({ "isClicked": true });
        this.refs.collectionList.querySelector(".collection-name.active").className = "collection-name";
        event.target.className = "collection-name active";
        this.props.dispatch(setCurrentCollection(collection));
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
            (<li className={className} onClick={(event) => this.collectionClick(event, collection)} key={collection._id}>{ collection.collection }
                    <button className="delete-collection" title={`Delete ${collection.collection}`} onClick = {(event) => {
                        event.stopPropagation();
                        this.props.dispatch(deleteCollection(event, collection._id));
                    }}
                    >
                        &times;</button>
                </li>
            );

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

    createNewCollection() {
        return (
            <div className="create_collection" onClick={() => {
                this.setState({ "showCollectionPopup": true });
            }}
            >
                <i className="fa fa-plus-circle"/> Create new collection
            </div>
        );

    }

    displayCollections() {
        return (<div className="collection-list-container" >
            <div className="search-bar">
                <Input className={"input-box"} placeholder="Search collections" eventHandlers={{ "onKeyUp": (event) => {
                    this._searchCollections(event);
                } }} addonSrc="./images/search-icon.png"
                />
            </div>
            {this.props.mainHeaderTab === WRITE_A_STORY ? <div className="select_collection">SELECT A COLLECTION</div> : this.createNewCollection()}
            {this.state.showCollectionPopup ? this.showPopup() : null}
            <div className="feeds">
                <ul className="configured-sources" ref="collectionList">
                    { this._renderCollections() }
                </ul>
            </div>
        </div>);
    }

    _isClicked() {
        this.setState({ "isClicked": false });
    }

    render() {
        return (
            this.props.mainHeaderTab === WRITE_A_STORY && this.state.isClicked
                ? <DisplayCollectionFeeds tab={this.props.mainHeaderTab} isClicked={this._isClicked.bind(this)}/>
                : this.displayCollections()
        );
    }
}

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds,
        "addArticleToCollection": store.addArticleToCollection,
        "mainHeaderTab": store.currentHeaderTab
    };
}

DisplayCollection.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "addArticleToCollection": PropTypes.object,
    "mainHeaderTab": PropTypes.string
};

export default connect(mapToStore)(DisplayCollection);
