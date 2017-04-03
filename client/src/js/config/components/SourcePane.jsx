import React, { Component, PropTypes } from "react";
import Sources from "./Sources";
import AddUrl from "./AddUrl";
import FacebookTabs from "./FacebookTabs";
import { WEB, TWITTER, addAllSources } from "./../../sourceConfig/actions/SourceConfigurationActions";
import R from "ramda"; //eslint-disable-line id-length
import { connect } from "react-redux";
import { showAddUrl } from "./../actions/AddUrlActions";

export class SourcePane extends Component {

    componentWillReceiveProps(nextProps) {
        if(this.props.currentTab !== nextProps.currentTab) {
            this.props.dispatch(showAddUrl(false));
        }
    }

    render() {
        return (
            <div className="sources-suggestions">
                {!(R.contains(this.props.currentTab, [WEB, TWITTER])) && <FacebookTabs />}
                <div className="configure-actions">
                    <button className="add-custom-url" onClick= {() => {
                        this.props.dispatch(showAddUrl(true));
                    }}
                    >
                        Add custom url
                    </button>
                    <button className="add-all" onClick= {() => {
                        this.props.dispatch(addAllSources());
                    }}
                    >
                        <img src="./images/add-btn-dark.png"/>
                        Add All
                    </button>
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
