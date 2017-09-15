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
        this._showToolTip = this._showToolTip.bind(this);
        this._hideToolTip = this._hideToolTip.bind(this);
        this.bookmarkArticle = this.bookmarkArticle.bind(this);
        this.hideArticle = this.hideArticle.bind(this);
        this._addToCollection = this._addToCollection.bind(this);
        this.addTextToCollection = (event) => this._addTextToCollection(event);
        this.copyTextToClipboard = (event) => this._copyTextToClipboard(event);
    }

    _showToolTip() {
        const marginTop = 50;
        const firstIndex = 0;
        let div = document.getElementById("toolTip");
        if(this.props.currentHeaderTab === SCAN_NEWS && this.props.newsBoardCurrentSourceTab !== newsBoardSourceTypes.collection && window.getSelection().toString()) {
            let selection = window.getSelection(), range = selection.getRangeAt(firstIndex), rect = range.getBoundingClientRect();

            div.style.top = `${rect.top - marginTop}px`;
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

    _addTextToCollection(event) {
        this._toolTipStyle(event);
        this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId, this._getSelectedTextDoc()));
    }

    _copyTextToClipboard(event) {
        this._toolTipStyle(event);
        document.execCommand("Copy");
    }

    renderBody() {
        const toolTip = (
            <div className="toolTip" id="toolTip">
                <button id="add" className="icon fa fa-folder-o" onClick={this.addTextToCollection}>{this.articleMessages.addToCollection}</button>
                <button id="copy" className="icon fa fa-copy" onClick={this.copyTextToClipboard}>{this.articleMessages.copy}</button>
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
                    ? <DisplayWebArticle toolTip={this._showToolTip}/>
                    : <div className="article__desc" onMouseUp={this._showToolTip}>
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

    _addToCollection() {
        this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId));
    }

    hideArticle() {
        this.props.collectionDOM.style.display = "block";
        this.props.dispatch(displayArticle());
    }

    renderHeader() {
        return(this.props.newsBoardCurrentSourceTab === newsBoardSourceTypes.collection
                ? <header className="display-article__header back">
                    <button className="back__button" onClick={this.hideArticle}>
                        <i className="icon fa fa-arrow-left" aria-hidden="true"/>{this.props.collectionName}</button>
                  </header>
                : <header className="display-article__header">
                    {this.props.feedCallback && this.renderBackbutton()}
                    {this.props.toolBar && this.renderArticleHeader()}
                </header>
        );
    }

    bookmarkArticle() {
        this.props.dispatch(bookmarkArticle(this.props.article, this.props.newsBoardCurrentSourceTab));
    }

    renderBackbutton() {
        return (
            <button className="back__button" onClick={this.props.feedCallback}>
                <i className="icon fa fa-arrow-left" aria-hidden="true"/> {this.articleMessages.backButton}
            </button>
        );
    }

    renderArticleHeader() {
        return(
            <div>
                <div className="collection" onClick={this._addToCollection}>
                    <i className="icon fa fa-folder"/>
                    <span> {this.articleMessages.addToCollection}</span>
                </div>

                {this.props.article.bookmark
                 ? <div className="bookmark active" onClick={this.bookmarkArticle}>
                     <i className="icon fa fa-bookmark"/>
                     <span> {this.articleMessages.bookmarked}</span>
                   </div>
                : <div className="bookmark" onClick={this.bookmarkArticle}>
                     <i className="icon fa fa-bookmark"/>
                     <span> {this.articleMessages.bookmark}</span>
                   </div>
                }
            </div>
        );
    }

    render() {
        this.articleMessages = Locale.applicationStrings().messages.newsBoard.article;
        if(this.props.article && this.props.article._id) {
            if(this.props.collectionDOM) {
                this.props.collectionDOM.style.display = "none";
            }

            return (
                <article className={this.props.feedCallback ? "story-display-article display-article" : "display-article"} onClick={this._hideToolTip}>
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
    "feedCallback": PropTypes.func,
    "currentHeaderTab": PropTypes.string,
    "toolBar": PropTypes.bool
};

function mapToStore(store) {
    return {
        "article": store.selectedArticle,
        "newsBoardCurrentSourceTab": store.newsBoardCurrentSourceTab,
        "currentHeaderTab": store.currentHeaderTab
    };
}

export default connect(mapToStore)(DisplayArticle);
