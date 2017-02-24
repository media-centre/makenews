import React, { Component, PropTypes } from "react";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import History from "../../History";
import StringUtil from "../../../../../common/src/util/StringUtil";
import NewsBoardTabs from "./../../newsboard/components/NewsBoardTabs";
import DisplayFeeds from "./../../newsboard/components/DisplayFeeds";
import { WRITE_A_STORY } from "./../../header/HeaderActions";

export class EditStory extends Component {
    constructor() {
        super();
        this.state = { "title": "", "body": "" };
        this._onChange = this._onChange.bind(this);
        this._onTitleChange = this._onTitleChange.bind(this);
        this.storyId = "";
        this.story = {};
    }

    componentDidMount() {
        let path = this.props.location.pathname; //eslint-disable-line react/prop-types
        this.storyId = path.slice(path.lastIndexOf("/") + 1, path.length); //eslint-disable-line no-magic-numbers
        if(this.storyId && this.storyId !== "story") {
            this._getStory(this.storyId);
        }
    }

    _getStory(storyId) {
        let ajax = AjaxClient.instance("/story");
        ajax.get({ "id": storyId }).then((response) => {
            this.story = response;
            this._onChange(this.story.body);
            this.setState({ "title": this.story.title });
        });
    }

    _saveStory() {
        let story = {};
        if(this.story._id) {
            story = this.story;
        }

        let title = this.state.title;
        if(this.state.body && !title) {
            title = this.props.untitledIndex;
        }
        story.title = title;
        story.body = this.state.body;

        let history = History.getHistory();

        if(StringUtil.isEmptyString(story.title) && StringUtil.isEmptyString(story.body)) {
            Toast.show("Cannot save empty story");
            history.push("/story-board/stories");
        } else {
            let ajax = AjaxClient.instance("/save-story");
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            ajax.put(headers, { story }).then(() => {
                Toast.show("Story saved successfully");
                history.push("/story-board/stories");
            }).catch((error) => {
                if(error.message === "Please add title") {
                    Toast.show(error.message);
                } else if(error.message === "Title Already exists") {
                    Toast.show(error.message);
                } else {
                    Toast.show("Not able to save");
                    history.push("/story-board/stories");
                }
            });
        }
    }

    _onChange(body) {
        this.setState({ body });
    }

    _onTitleChange(event) {
        this.setState({ "title": event.target.value });
    }

    render() {
        return (
            <div className="story-board story-collections">
                <div className="editor-container">
                    <input className = "story-title" ref = "title" placeholder = "please enter title" value = {this.state.title} onChange={this._onTitleChange}/>
                    <button ref="saveButton" type="submit" className="story-save" value="save" onClick={() => {
                        this._saveStory();
                    }}
                    >
                    { "SAVE" }</button>
                    <ReactQuill className = "story-editor" placeholder = "Write a story" value={this.state.body} theme="snow" onChange={this._onChange}/>
                </div>

                <DisplayFeeds currentHeaderTab={WRITE_A_STORY}/>

                <div className="source-type-bar">
                    <NewsBoardTabs />
                </div>
            </div>
        );
    }
}

EditStory.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "untitledIndex": PropTypes.string
};


function mapToStore(store) {
    return {
        "untitledIndex": store.untitledIndex
    };
}
export default connect(mapToStore)(EditStory);
