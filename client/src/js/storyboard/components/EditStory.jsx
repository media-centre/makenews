import React, { Component, PropTypes } from "react";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import History from "../../History";
import { gotStory } from "../actions/StoryBoardActions";

export class EditStory extends Component {
    constructor() {
        super();
        this.state = { "title": "", "body": "" };
        this._onChange = this._onChange.bind(this);
        this._onTitleChange = this._onTitleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.story !== nextProps.story) {
            this.setState({ "title": nextProps.story.title });
            this._onChange(nextProps.story.body);
        }
    }

    componentWillUnmount() {
        this.props.dispatch(gotStory({}));
    }

    _saveStory() {
        let story = {};
        if(this.props.story._id) {
            story = this.props.story;
            story.title = this.state.title;
            story.body = this.state.body;
        } else {
            story = { "title": this.state.title, "body": this.state.body };
        }
        let ajax = AjaxClient.instance("/save-story");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        ajax.put(headers, { story }).then((response) => {
            Toast.show("Story saved successfully");
            let history = History.getHistory();
            history.push(`/story-board/story/edit/${response.id}`);
        }).catch((error) => {
            if(error.message === "Cannot save empty story" || error.message === "Title Already exists") {
                Toast.show(error.message);
            } else {
                Toast.show("Not able to save");
            }
        });
    }

    _onChange(body) {
        this.setState({ body });
    }

    _onTitleChange(event) {
        this.setState({ "title": event.target.value });
    }

    render() {
        return (
            <div className="story-board">
                <div className="collections">
                    <h1>Collections</h1>
                </div>
                <div className="editor-container">
                    <input className = "story-title" ref = "title" placeholder = "please enter title" value = {this.state.title} onChange={this._onTitleChange}/>
                    <button ref="saveButton" type="submit" className="story-save" value="save" onClick={() => {
                        this._saveStory();
                    }}
                    >
                    { "SAVE" }</button>
                    <ReactQuill className = "story-editor" placeholder = "Write a story" value={this.state.body} theme="snow" onChange={this._onChange}/>
                </div>
            </div>
        );
    }
}

EditStory.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "story": PropTypes.object
};


function mapToStore(store) {
    return {
        "story": store.story
    };
}
export default connect(mapToStore)(EditStory);
