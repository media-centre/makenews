import React, { Component } from "react";
import PropTypes from "prop-types";
import Sources from "./Sources";
import AddUrl from "./AddUrl";
import FacebookTabs from "./FacebookTabs";
import { WEB, TWITTER, addAllSources } from "./../../sourceConfig/actions/SourceConfigurationActions";
import { GROUPS } from "./../../config/actions/FacebookConfigureActions";
import R from "ramda"; //eslint-disable-line id-length
import { connect } from "react-redux";
import { showAddUrl } from "./../actions/AddUrlActions";
import Locale from "./../../utils/Locale";

export class SourcePane extends Component {

    constructor() {
        super();
        this._showAddUrl = this._showAddUrl.bind(this);
        this._addAllSources = this._addAllSources.bind(this);
    }

    _showAddUrl() {
        this.props.dispatch(showAddUrl(true));
    }

    _addAllSources() {
        this.props.dispatch(addAllSources());
    }

    render() {
        const configurePageStrings = Locale.applicationStrings().messages.configurePage;
        return (
            <div className="sources-suggestions">
                {!(R.contains(this.props.currentTab, [WEB, TWITTER])) && <FacebookTabs />}
                <div className="configure-actions">
                    {
                        (this.props.currentTab !== GROUPS) &&
                        <button className="add-custom-url" onClick={this._showAddUrl}>
                            <i className="icon fa fa-plus" aria-hidden="true"/>
                            {configurePageStrings.addCustomUrl.name}
                        </button>
                    }
                </div>
                { this.props.showAddUrl ? <AddUrl currentTab={this.props.currentTab}/> : <Sources /> }
            </div>
        );
    }
}

SourcePane.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "showAddUrl": PropTypes.bool
};

function mapToStore(store) {
    return {
        "showAddUrl": store.showAddUrl
    };
}

export default connect(mapToStore)(SourcePane);
