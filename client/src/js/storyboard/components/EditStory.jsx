import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import History from "../../History";
import StringUtil from "../../../../../common/src/util/StringUtil";
import NewsBoardTabs from "./../../newsboard/components/NewsBoardTabs";
import DisplayFeeds from "./../../newsboard/components/DisplayFeeds";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import FileSaver from "file-saver";
import AppWindow from "./../../utils/AppWindow";

export class EditStory extends Component {

    static blobInstance(byteNumbers) {
        return new Blob([byteNumbers], { "type": "text/html" });
    }

    constructor() {
        super();
        this.state = { "title": "", "body": "" };
        this._onChange = this._onChange.bind(this);
        this._onTitleChange = this._onTitleChange.bind(this);
        this.storyId = "";
        this.story = {};
    }

    componentDidMount() {
        const path = this.props.location.pathname;
        this.storyId = path.slice(path.lastIndexOf("/") + 1, path.length); //eslint-disable-line no-magic-numbers
        if(this.storyId && this.storyId !== "story") {
            this._getStory(this.storyId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    autoSave() {
        const STORY_AUTO_SAVE_TIME_INTERVAL = AppWindow.instance().get("storyAutoSaveTimeInterval");
        this.interval = setInterval(async() => { this._saveStory(); }, STORY_AUTO_SAVE_TIME_INTERVAL); //eslint-disable-line brace-style
    }

    async _getStory(storyId) {
        const ajax = AjaxClient.instance("/story");
        await ajax.get({ "id": storyId }).then((response) => {
            this.story = response;
            this._onChange(this.story.body);
            this.setState({ "title": this.story.title });
        });
        this.autoSave();
    }

    async _saveStory() {
        if(this.storyId) {
            let title = this.state.title;
            if (this.state.body && !title) {
                this.story.title = this.props.untitledIndex;
            } else {
                this.story.title = this.state.title;
            }
            this.story.body = this.state.body;
        }

        if(StringUtil.isEmptyString(this.story.title) && StringUtil.isEmptyString(this.story.body)) {
            Toast.show("Cannot save empty story");
        } else {
            let ajax = AjaxClient.instance("/save-story");
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            try{
                let response = await ajax.put(headers, { "story": this.story });
                this.story._rev = response.rev;
                this.story._id = response.id;
                Toast.show("Story saved successfully", "success");
            } catch(error) {
                if(error.message === "Please add title") {
                    Toast.show(error.message);
                } else if(error.message === "Title Already exists") {
                    Toast.show(error.message);
                } else {
                    Toast.show("Not able to save");
                }
            }
        }
    }

    _exportHtml() {
        let htmlString = `<html style="line-height: 1.5rem;"><body><h1>${this.state.title}</h1>${this.state.body}</body></html>`;
        let byteNumbers = new Uint8Array(htmlString.length);
        [...htmlString].map((htmlChar, index) => {
            byteNumbers[index] = htmlChar.charCodeAt();
        });
        let blob = EditStory.blobInstance(byteNumbers);
        FileSaver.saveAs(blob, `${this.state.title}.html`);
    }

    _onChange(body) {
        this.setState({ body });
    }

    _onTitleChange() {
        this.setState({ "title": this.refs.title.value });
    }

    _back() {
        let history = History.getHistory();
        history.push("/story-board/stories");
    }

    render() {
        return (
            <div className="story-board story-collections">
                <div className="editor-container">
                    <div className="editor-toolbar">
                        <button className="back" onClick={this._back}>Back</button>
                        <ReactQuill.Toolbar key="toolbar" theme="snow" id="toolbar" ref="toolbar" className="ql-toolbar ql-snow"/>
                        <button ref="saveButton" type="submit" className="save" value="save" onClick={async() => {
                            this._saveStory();
                        }}
                        >
                        { "SAVE" }</button>
                    </div>
                    <div className="title-bar">
                        <input className="story-title" ref="title" placeholder="please enter title" value={this.state.title} onChange={this._onTitleChange}/>
                    </div>
                    <ReactQuill className="story-editor" theme="snow" onChange={this._onChange} modules={EditStory.modules} toolbar={false} value={this.state.body}/>
                    <div className="export-container">
                        <i className="fa fa-share export-icon" onClick={() => this._exportHtml()} />
                    </div>
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
    "untitledIndex": PropTypes.string,
    "location": PropTypes.object
};

EditStory.modules = {
    "link-tooltip": true,
    "image-tooltip": true,
    "toolbar": {
        "container": ".ql-toolbar"
    }
};

function mapToStore(store) {
    return {
        "untitledIndex": store.untitledIndex
    };
}
export default connect(mapToStore)(EditStory);
