/* eslint react/no-danger:0 */
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { displayWebArticle } from "./../actions/DisplayArticleActions";

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
            <div className="article__desc" dangerouslySetInnerHTML={{ "__html": this.props.article }} />
        );
    }
}

DisplayWebArticle.propTypes = {
    "article": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "selectedArticle": PropTypes.object.isRequired
};

function mapToStore(store) {
    return {
        "article": store.webArticleMarkup,
        "selectedArticle": store.selectedArticle
    };
}

export default connect(mapToStore)(DisplayWebArticle);
