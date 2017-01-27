import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { displayWebArticle } from "./../actions/DisplayArticleActions";

export class DisplayWebArticle extends Component {
    componentWillMount() {
        this.props.dispatch(displayWebArticle(this.props.selectedArticle.link));
    }

    // componentShouldUpdate(nextProps) {
    //     if(this.props.selectedArticle.link !== nextProps.selectedArticle.link) {
    //         this.props.dispatch(displayWebArticle(nextProps.selectedArticle.link));
    //     }
    // }

    render() {
        return (
            <div>
                {this.props.article}
            </div>
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
        "article": store.selectedWebArticle,
        "selectedArticle": store.selectedArticle
    };
}

export default connect(mapToStore)(DisplayWebArticle);
