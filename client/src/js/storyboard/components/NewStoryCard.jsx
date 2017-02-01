import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
//import * as StoryBoardActions from "../actions/StoryBoardActions";
import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";

export class NewStoryCard extends Component {

    componentDidMount() {
        this.storyId = decodeURIComponent(this.props.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("storyId").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        this.story = {};
        if(this.storyId) {
            this.story = this.getFromDb();
        }
    }

    getFromDb() {
        let ajax = AjaxClient.instance("/get-story");
        ajax.get({ "id": this.storyId }).then((response) =>{
            this.story = response;
            this.refs.title.value = response.title;
        });
    }

    _onKeyDownInputBox(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this._addTitle();
        }
    }
    _addTitle() {
        let title = this.refs.title.value.trim();
        this.story.title = title;
        this._updateStory(this.story);
    }

    _updateStory(story) {
        let ajax = AjaxClient.instance("/add-story");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        ajax.post(headers, story).then((response) => {
            Toast.show("Title added successfully");
            return response;
        }).catch(() => {
            Toast.show("EITHER you entered/saved title more than once OR Story title already exists.");
        });
    }

    render() {
        return (
          <div className="story-card-title">
              <input ref="title" className="title-box" type="text" placeholder="please enter title of the story" onKeyDown={(event) => this._onKeyDownInputBox(event)}/>
              <button ref="saveButton"type="submit" className="save-box" value="save" onClick={() => {
                  this._addTitle();
              }}
              >{ "SAVE" }</button>
          </div>
        );
    }
}

NewStoryCard.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "location": PropTypes.object
};


function select(store) {
    return store;
}
export default connect(select)(NewStoryCard);

