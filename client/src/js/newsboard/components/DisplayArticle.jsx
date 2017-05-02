/* eslint brace-style:0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DisplayWebArticle from "./DisplayWebArticle";
import DateTimeUtil from "../../utils/DateTimeUtil";
import { bookmarkArticle, addArticleToCollection } from "./../actions/DisplayArticleActions";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { newsBoardSourceTypes } from "./../../utils/Constants";
import { SCAN_NEWS } from "../../header/HeaderActions";
import Locale from "./../../utils/Locale";

export class DisplayArticle extends Component {
    constructor() {
        super();
        this._getSelectedTextDoc = this._getSelectedTextDoc.bind(this);
    }

    _showToolTip() {
        let div = document.getElementById("toolTip");
        if(this.props.currentHeaderTab === SCAN_NEWS && window.getSelection().toString()) {
            let selection = window.getSelection(), range = selection.getRangeAt(0), rect = range.getBoundingClientRect();  //eslint-disable-line no-magic-numbers

            div.style.top = rect.top - 50 + "px"; //eslint-disable-line no-magic-numbers
            div.style.display = "block";
            div.style.left = rect.left + "px";
        }
        else {
            div.style.display = "none";
        }
    }

    _hideToolTip() {
        const toolTip = document.getElementById("toolTip");
        if(toolTip && !window.getSelection().toString()) {
            toolTip.style.display = "none";
        }
    }

    renderBody() {
        const toolTip = (
            <div className="toolTip" id="toolTip">
                <button id="add" className="icon fa fa-folder-o" onClick={(event) => { this._toolTipStyle(event); this._addToCollection(); }}>{this.articleMessages.addToCollection}</button>
                <button id="copy" className="icon fa fa-copy" onClick={(event) => { this._toolTipStyle(event); this._copyToClipboard(); }}/>
            </div>);

        return (
            <main className="article">
                <h1 className="article__title">
                    { this.props.article.title }
                </h1>

                <div className="article__details">
                    <i className={`fa fa-${this.props.article.sourceType}`} />
                    <span>{` | ${DateTimeUtil.getLocalTime(this.props.article.pubDate)}`}</span>
                    {
                        this.props.article.tags &&
                        this.props.article.tags.map((tag, index) => <span key={index}>{` | ${tag}`}</span>)
                    }
                </div>

                <div className="article__images">
                    { this.props.article.images && this.props.article.images.map((image, index) => <img key={index} src={image.url} />) }
                </div>

                {this.props.article.sourceType === "web" && (!this.props.article.selectText || this.props.article.sourceDeleted)
                    ? <DisplayWebArticle toolTip={this._showToolTip.bind(this)}/>
                    : <div className="article__desc" onMouseUp={() => { this._showToolTip(); }}>
                    { this.props.article.description }
                </div>
                }

                <div className="article__original-source">
                    <a href={this.props.article.link} target="_blank" rel="nofollow noopener noreferrer">{this.articleMessages.readOriginalArticle}</a>
                </div>
                {toolTip}
            </main>
        );
    }

    _getSelectedTextDoc() {
        const feed = this.props.article;
        return {
            "title": feed.title,
            "tags": feed.tags,
            "description": window.getSelection().toString(),
            "link": feed.link,
            "sourceType": feed.sourceType,
            "pubDate": feed.pubDate
        };
    }

    _toolTipStyle(event) {
        event.stopPropagation();
        let parentDiv = document.getElementById("toolTip");
        parentDiv.style.display = "none";
    }

    _copyToClipboard() {
        document.execCommand("Copy");
    }

    _addToCollection() {
        this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId, this._getSelectedTextDoc()));
    }

    renderHeader() {
        return(this.props.newsBoardCurrentSourceTab === newsBoardSourceTypes.collection
                ? <header className="display-article__header back">
                    <button className="back__button" onClick={() => { this.props.collectionDOM.style.display = "block"; this.props.dispatch(displayArticle()); }}>
                        <i className="icon fa fa-arrow-left" aria-hidden="true"/>{this.props.collectionName}</button>
                  </header>
                : this.renderArticleHeader()
        );

    }

    renderArticleHeader() {
        return(
            this.props.isStoryBoard
                ? <header className={`${this.articleClass}__header back`}>
                    <button className="back__button" onClick={() => { this.props.articleOpen(); }}>
                        <i className="icon fa fa-arrow-left" aria-hidden="true"/> {this.articleMessages.backButton}
                    </button>
                  </header>

                : <header className={`${this.articleClass}__header`}>
                    <div className="collection" onClick={() => { this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
                        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId));
                    }}
                    >
                        <i className="icon fa fa-folder"/> {this.articleMessages.addToCollection}
                    </div>

                    {this.props.article.bookmark
                        ? <div className="bookmark active" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article, this.props.newsBoardCurrentSourceTab)); }}>
                            <i className="icon fa fa-bookmark"/> {this.articleMessages.bookmarked}
                          </div>
                        : <div className="bookmark" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article, this.props.newsBoardCurrentSourceTab)); }}>
                            <i className="icon fa fa-bookmark"/> {this.articleMessages.bookmark}
                          </div>
                    }
                  </header>);
    }

    render() {
        this.articleMessages = Locale.applicationStrings().messages.newsBoard.article;
        this.articleClass = this.props.isStoryBoard ? "story-display-article display-article" : "display-article";
        if(this.props.article && this.props.article._id) {
            if(this.props.collectionDOM) {
                this.props.collectionDOM.style.display = "none";
            }
            return (
                <article className={this.articleClass} onClick={() => { this._hideToolTip(); }}>
                    { this.renderHeader() }
                    { this.renderBody() }
                </article>
            );
        }
        if(this.props.newsBoardCurrentSourceTab !== newsBoardSourceTypes.collection) {
            return (
                <div className="display-article">
                    <div className="default-message">{this.articleMessages.defaultMessage}</div>
                </div>);
        }
        return null;
    }
}

DisplayArticle.propTypes = {
    "article": PropTypes.object,
    "dispatch": PropTypes.func.isRequired,
    "newsBoardCurrentSourceTab": PropTypes.string.isRequired,
    "collectionDOM": PropTypes.object,
    "collectionName": PropTypes.string,
    "articleOpen": PropTypes.func,
    "isStoryBoard": PropTypes.bool,
    "currentHeaderTab": PropTypes.string
};

function mapToStore(store) {
    return {
        "article": store.selectedArticle,
        "newsBoardCurrentSourceTab": store.newsBoardCurrentSourceTab,
        "currentHeaderTab": store.currentHeaderTab
    };
}

export default connect(mapToStore)(DisplayArticle);
