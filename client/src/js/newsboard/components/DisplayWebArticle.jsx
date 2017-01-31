/* eslint react/no-danger:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { displayWebArticle } from "./../actions/DisplayArticleActions";
import Spinner from "./../../utils/components/Spinner";

export class DisplayWebArticle extends Component {
    componentWillMount() {
        this.props.dispatch(displayWebArticle(this.props.selectedArticle));
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.selectedArticle.link !== nextProps.selectedArticle.link) {
            this.props.dispatch(displayWebArticle(nextProps.selectedArticle));
        }
    }

    render() {
        return (
            this.props.isFetchingArticle
                ? <Spinner />
                : <div className="article__desc" dangerouslySetInnerHTML={{ "__html": this.props.article }}/>
        );
    }
}

DisplayWebArticle.propTypes = {
    "article": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "selectedArticle": PropTypes.object.isRequired,
    "isFetchingArticle": PropTypes.object.isRequired
};

function mapToStore(store) {
    return {
        "article": store.webArticleMarkup,
        "selectedArticle": store.selectedArticle,
        "isFetchingArticle": store.fetchingWebArticle
    };
}

export default connect(mapToStore)(DisplayWebArticle);
