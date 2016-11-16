import React, { Component, PropTypes } from "react";
import SourcesResults from "./SourcesResults";
import { connect } from "react-redux";
import { facebookSearchSources } from "./../actions/FacebookConfigureActions";

class Configure extends Component {

    _onKeyDown(event) {
        const ENTERKEY = 13;
        if(event.keyCode === ENTERKEY) {
            this.props.dispatch(facebookSearchSources(this.refs.searchSources.value));
        }
    }

    render() {
        return (

          <div className="configure-sources">
              <input type="text" ref="searchSources" className="search-sources" placeholder="Search...." onKeyDown={(event) => this._onKeyDown(event)} />
              <SourcesResults sources={this.props.sources}/>
          </div>
        );
    }
}

function mapToStore(state) {
    return {
        "sources": state.facebookUrls
    };
}

Configure.propTypes = {
    "sources": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(Configure);
