/* eslint brace-style:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DisplayWebArticle from "./DisplayWebArticle";
import DateTimeUtil from "../../utils/DateTimeUtil";
import { bookmarkArticle, addArticleToCollection } from "./../actions/DisplayArticleActions";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export class DisplayArticle extends Component {
    constructor() {
        super();
        this._getSelectedTextDoc = this._getSelectedTextDoc.bind(this);
    }

    _showOptions() {

        event.preventDefault();
        let selection = window.getSelection(), range = selection.getRangeAt(0), rect = range.getBoundingClientRect();  //eslint-disable-line
        let text = selection.toString();

        let div = document.getElementById("toolTip");
        div.style.display = "block";
        let copy = document.getElementById("copy");
        let add = document.getElementById("add");


        copy.setAttribute("class", "icon fa fa-copy");
        copy.setAttribute("aria-hidden", true);
        copy.setAttribute("title", "Copy to Clipboard");

        add.setAttribute("class", "icon fa fa-folder-o");
        add.setAttribute("aria-hidden", true);

        add.addEventListener("click", (event) => {
            event.stopPropagation();
            div.style.display = "none";

            this._addToCollection(text);
        });

        copy.addEventListener("click", (event) => {
            event.stopPropagation();
            div.style.display = "none";

            this._copyToClipboard();
        });


        div.setAttribute("class", "toolTip");

        div.style.top = rect.top-50 + "px"; //eslint-disable-line
        div.style.left = rect.left + "px";
    }

    renderBody() {
        let toolTip = (<div className="toolTip" id="toolTip">
            <button id="add" className="icon fa fa-folder-o">Add To Collection</button>
            <button id="copy" className="icon fa fa-copy"/>
        </div>);
        return (<main className="article">
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

            {this.props.article.sourceType === "web" && !this.props.article.selectText
                ? <DisplayWebArticle toolTip={this._showOptions.bind(this)}/>
                : <div className="article__desc" onMouseUp={() => { this._showOptions(); }}>
                { this.props.article.description }
            </div>
            }

            <div className="article__original-source">
                <a href={this.props.article.link} target="_blank" rel="nofollow noopener noreferrer">Read the Original Article</a>
            </div>
            {toolTip}
        </main>);
    }

    _getSelectedTextDoc(selectedText) {
        const feed = this.props.article;
        return {
            "title": feed.title,
            "tags": feed.tags,
            "description": selectedText,
            "link": feed.link,
            "sourceType": feed.sourceType,
            "pubDate": feed.pubDate
        };
    }

    _copyToClipboard() {
        document.execCommand("Copy");
    }

    _addToCollection(selectedText) {
        this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId, this._getSelectedTextDoc(selectedText)));
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
                        <i className="icon fa fa-arrow-left" aria-hidden="true"/> back
                    </button>
                  </header>

                : <header className={`${this.articleClass}__header`}>
                <div className="collection" onClick={() => { this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
                    this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab, this.props.article.sourceId));
                }}
                >
                    <i className="icon fa fa-folder-o"/> Add to collection
                </div>

                {
                    this.props.article.bookmark
                        ? <div className="bookmark active" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article, this.props.newsBoardCurrentSourceTab)); }}>
                        <i className="icon fa fa-bookmark"/> Bookmarked
                    </div>
                        : <div className="bookmark" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article, this.props.newsBoardCurrentSourceTab)); }}>
                        <i className="icon fa fa-bookmark"/> Bookmark
                    </div>
                }
            </header>);
    }

    render() {
        this.articleClass = this.props.isStoryBoard ? "story-display-article display-article" : "display-article";
        if(this.props.article && this.props.article._id) {
            if(this.props.collectionDOM) {
                this.props.collectionDOM.style.display = "none";
            }
            return (
                <article className={this.articleClass}>
                    { this.renderHeader() }
                    { this.renderBody() }
                </article>
            );
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
    "isStoryBoard": PropTypes.bool
};

function mapToStore(store) {
    return {
        "article": store.selectedArticle,
        "newsBoardCurrentSourceTab": store.newsBoardCurrentSourceTab
    };
}

export default connect(mapToStore)(DisplayArticle);
