import React, { Component, PropTypes } from "react";
import { TWITTER, WEB } from "../../sourceConfig/actions/SourceConfigurationActions";

export default class SourceFilters extends Component {

    _listSourcesGroup(heading, sourceType, searchKey) {
        return (
            <div className="list-sources__group open">
                <h4 className="list-sources__group__heading">{heading}</h4>
                <ul className="list-sources">
                    { this.props.renderSources(sourceType, searchKey) }
                </ul>
            </div>
        );
    }

    render() {
        if(this.props.currentTab === TWITTER) {
            return (
                <div className="list-sources-block">
                    { this._listSourcesGroup("Twitter", "twitter", this.props.searchKeyword) }
                </div>
            );
        }

        if(this.props.currentTab === WEB) {
            return (
                <div className="list-sources-block">
                    { this._listSourcesGroup("Web", "web", this.props.searchKeyword) }
                </div>
            );
        }

        return (
            <div className="list-sources-block">
                { this._listSourcesGroup("Facebook Pages", "pages", this.props.searchKeyword) }
                { this._listSourcesGroup("Facebook Groups", "groups", this.props.searchKeyword) }
            </div>
        );
    }
}

SourceFilters.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "searchKeyword": PropTypes.string.isRequired,
    "renderSources": PropTypes.func
};
