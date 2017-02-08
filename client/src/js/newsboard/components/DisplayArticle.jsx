/* eslint brace-style:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DisplayWebArticle from "./DisplayWebArticle";
import DateTimeUtil from "../../utils/DateTimeUtil";
import { bookmarkArticle, addArticleToCollection } from "./../actions/DisplayArticleActions";
import { setReadMore } from "./../actions/DisplayCollectionActions";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { newsBoardSourceTypes } from "./../../utils/Constants";
import Toast from "./../../utils/custom_templates/Toast";

export class DisplayArticle extends Component {
    render() {
        return (
            <article className="display-article">
                {this.props.newsBoardCurrentSourceTab === newsBoardSourceTypes.collection
                    ? <header className="display-article__header back"> <button className="back__button" onClick={() => { this.props.dispatch(setReadMore(false)); }}><i className="icon fa fa-arrow-left" aria-hidden="true"/> Back</button> </header>

                    : <header className="display-article__header">
                    <div className="collection" onClick={() => { this.props.dispatch(newsBoardTabSwitch(newsBoardSourceTypes.collection));
                        this.props.dispatch(addArticleToCollection(this.props.article._id, this.props.newsBoardCurrentSourceTab));
                    }}
                    >
                        <i className="icon fa fa-folder-o"/> Add to collection
                    </div>

                    { this.props.article.bookmark
                        ? <div className="bookmark active" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article)); }}>
                             <i className="icon fa fa-bookmark"/> Bookmarked
                          </div>
                        : <div className="bookmark" onClick={() => { this.props.dispatch(bookmarkArticle(this.props.article)); }}>
                             <i className="icon fa fa-bookmark"/> Bookmark
                          </div>
                    }
                </header>}
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
                    {this.props.article.sourceType === "web"
                        ? <DisplayWebArticle />
                        : <div className="article__desc">
                            { this.props.article.description }
                          </div>}

                </main>
                { this.props.addToCollectionStatus.message && (<div className="add-to-collection-message">{Toast.show(this.props.addToCollectionStatus.message)}</div>)}
            </article>
        );
    }
}

DisplayArticle.propTypes = {
    "article": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "newsBoardCurrentSourceTab": PropTypes.string.isRequired,
    "addToCollectionStatus": PropTypes.object.isRequired
};

function mapToStore(store) {
    return {
        "article": store.selectedArticle,
        "newsBoardCurrentSourceTab": store.newsBoardCurrentSourceTab,
        "addToCollectionStatus": store.addToCollectionStatus
    };
}

export default connect(mapToStore)(DisplayArticle);
