/* eslint brace-style:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bookmarkArticle } from "./../actions/DisplayArticleActions";

export class DisplayArticle extends Component {
    render() {
        return (
            <article className="display-article">
                <header className="display-article__header">
                    { this.props.article.bookmark
                        ? <div className="bookmark active" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article)); }}>
                             <i className="icon fa fa-bookmark"/> Bookmarked
                          </div>
                        : <div className="bookmark" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article)); }}>
                             <i className="icon fa fa-bookmark"/> Bookmark
                          </div>
                    }
                </header>
                <main className="article">
                    <h1 className="article__title">
                        { this.props.article.title }
                    </h1>
                    <div className="article__details">
                        <i className={`fa fa-${this.props.article.sourceType}`} />
                        <span>{` | ${this.props.article.pubDate}`}</span>
                        {
                            this.props.article.tags &&
                            this.props.article.tags.map((tag, index) => <span key={index}>{` | ${tag}`}</span>)
                        }
                    </div>
                    <div className="article__images">
                        { this.props.article.images && this.props.article.images.map((image, index) => <img key={index} src={image.url} />) }
                    </div>
                    <div className="article__desc">
                        { this.props.article.description }
                    </div>
                </main>
            </article>
        );
    }
}

DisplayArticle.propTypes = {
    "article": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};

function mapToStore(store) {
    return { "article": store.selectedArticle };
}

export default connect(mapToStore)(DisplayArticle);
