import React, { Component } from "react";
import PropTypes from "prop-types";
import { setCurrentCollection, deleteCollection, renameCollection } from "./../actions/DisplayCollectionActions";
import { addToCollection } from "../actions/DisplayArticleActions";
import StringUtil from "./../../../../../common/src/util/StringUtil";
import { connect } from "react-redux";
import Input from "./../../utils/components/Input";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import DisplayCollectionFeeds from "./DisplayCollectionFeeds";
import InlineEdit from "./../../utils/components/InlineEdit";
import R from "ramda"; //eslint-disable-line id-length
import Locale from "./../../utils/Locale";

export class DisplayCollection extends Component {
    constructor() {
        super();
        this.state = { "showCollectionPopup": false, "searchKey": "", "isClicked": false, "showConfirmationPopup": false };
        this.buttonEvent = {};
        this.deleteCollection = {};
    }

    componentWillReceiveProps(nextProps) {
        const currentCollection = this.refs.collectionList.querySelector(".collection-name.active");
        const [firstCollection] = nextProps.feeds;

        if((!currentCollection && firstCollection)) {
            let setCollection = this.refs.collectionList.querySelector(".collection-name");
            if(setCollection) {
                setCollection.className = "collection-name active";
            }
            this.props.dispatch(setCurrentCollection(firstCollection));
        }
    }


    collectionClick(event, collection) {
        this.setState({ "isClicked": true });
        this.refs.collectionList.querySelector(".collection-name.active").className = "collection-name";
        if(event.target.tagName === "SPAN") {
            event.target.parentNode.parentNode.className = "collection-name active";
        } else if(event.target.tagName === "LI") {
            event.target.className = "collection-name active";
        } else {
            event.target.parentNode.className = "collection-name active";
        }
        this.props.dispatch(setCurrentCollection(collection));
        if(this.props.addArticleToCollection.id) {
            this.props.dispatch(addToCollection(collection.collection, this.props.addArticleToCollection));
        }
    }

    _deleteCollectionEvent() {
        this.setState({ "showConfirmationPopup": false });
        this.props.dispatch(deleteCollection(this.buttonEvent, this.deleteCollection._id));
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
            (<li tabIndex="0" className={className} onClick={(event) => this.collectionClick(event, collection)} key={collection._id}>
                    {this.props.mainHeaderTab === "Write a Story" && collection.collection}
                    {this.props.mainHeaderTab !== "Write a Story" &&
                    <InlineEdit
                        text={collection.collection}
                        paramName="newCollectionName"
                        className="title"
                        stopPropagation
                        change={(value) => {
                            this.props.dispatch(renameCollection(collection._id, value.newCollectionName));
                        }}
                    />}
                    {this.props.mainHeaderTab !== "Write a Story" &&
                    <button className="delete-collection" title={`Delete ${collection.collection}`} onClick={(event) => {
                        event.stopPropagation();
                        this.buttonEvent = Object.assign({}, event);
                        this.deleteCollection = collection;
                        this.setState({ "showConfirmationPopup": true });
                    }}
                    > &times; </button>}
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
            const collectionName = (this.refs.collectionName.value).trim();
            this.props.dispatch(addToCollection(collectionName, this.props.addArticleToCollection, true));
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
                    >{this.collectionMessages.cancelButton}
                    </button>

                    <button className="save-collection" onClick={() => {
                        if (!StringUtil.isEmptyString(this.refs.collectionName.value)) {
                            this.props.dispatch(addToCollection(this.refs.collectionName.value.trim(), this.props.addArticleToCollection, true));
                        }
                        this.setState({ "showCollectionPopup": false });
                    }}
                    >{this.collectionMessages.saveButton}
                    </button>
                </div>
                }
            </div>
        );
    }

    showConfirmationPopup() {
        return (
            <div className="confirmation-popup-overlay">
                <div className="delete-confirmation-popup">
                    <div className="confirmation-text">{this.collectionMessages.confirmDelete}<b>{this.deleteCollection.collection}</b>?</div>
                    <button className="cancel-collection" onClick={() =>
                        this.setState({ "showConfirmationPopup": false })
                    }
                    >NO</button>
                    <button className="delete-confirmed" onClick={() =>
                        this._deleteCollectionEvent()
                    }
                    >YES</button>
                </div>
            </div>
        );
    }

    createNewCollection() {
        return (
            <div className="create_collection" onClick={() => {
                this.setState({ "showCollectionPopup": true });
            }}
            >
                <i className="fa fa-plus-circle icon"/> {this.collectionMessages.createCollection}
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
            {this.props.mainHeaderTab === WRITE_A_STORY ? <div className="select_collection">{this.collectionMessages.selectCollection}</div> : this.createNewCollection()}
            {this.state.showCollectionPopup ? this.showPopup() : null}
            {this.state.showConfirmationPopup ? this.showConfirmationPopup() : null}
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
        this.collectionMessages = Locale.applicationStrings().messages.newsBoard.collection;
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
