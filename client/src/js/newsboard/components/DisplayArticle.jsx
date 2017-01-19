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
                <main>
                    { this.props.article.description }
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
