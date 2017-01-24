import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as StoryBoardActions from "../actions/StoryBoardActions";
import History from "../../History";

export class StoryCard extends Component {


    _onKeyDownInputBox(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this._addTitle();
        }
    }
    _addTitle() {
        let title = this.refs.title.value.trim();
        this.props.dispatch(StoryBoardActions.addTitleToStory(title));
        let history = History.getHistory();
        history.push("/storyBoard/newStory");

    }

    render() {
        return (
          <div className="story-card-title">
              <input ref="title" className="title-box" type="text" placeholder="please enter title of the story" onKeyDown={(event) => this._onKeyDownInputBox(event)}/>
              <button type="submit" className="save-box" value="save" onClick={() => {
                  this._addTitle();
              }}
              >{ "SAVE" }</button>
          </div>
        );
    }
}

StoryCard.propTypes = {
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return store;
}
export default connect(select)(StoryCard);

