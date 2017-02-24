import React, { Component, PropTypes } from "react";
import { setCollectionName } from "./../actions/DisplayCollectionActions";
import { addToCollection } from "../actions/DisplayArticleActions";
import StringUtil from "./../../../../../common/src/util/StringUtil";
import { connect } from "react-redux";

export class DisplayCollection extends Component {
    constructor() {
        super();
        this.state = { "showCollectionPopup": false };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.feeds[0]) { //eslint-disable-line no-magic-numbers
            let collectionName = nextProps.feeds[0].collection; //eslint-disable-line no-magic-numbers
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
        let [first, ...rest] = this.props.feeds;
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

    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.props.dispatch(addToCollection(this.refs.collectionName.value, this.props.addArticleToCollection, true));
            this.setState({ "showCollectionPopup": false });
        }
    }

    showPopup() {
        return (
            <div className="collection-popup-overlay">
                {this.state.showCollectionPopup && <div className="new-collection">
                    <input type="text" className="new-collection-input-box" ref="collectionName"
                        placeholder="create new collection" onKeyUp={(event) => {
                            this.checkEnterKey(event);
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

    displayCollections() {
        return (<div className="configured-feeds-container" >
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
        </div>);
    }

    render() {
        return (
           this.displayCollections()
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
