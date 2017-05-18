import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import History from "../../History";
import StringUtil from "../../../../../common/src/util/StringUtil";
import NewsBoardTabs from "./../../newsboard/components/NewsBoardTabs";
import DisplayFeeds from "./../../newsboard/components/DisplayFeeds";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import FileSaver from "file-saver";
import AppWindow from "./../../utils/AppWindow";
import Locale from "./.././../utils/Locale";
import { popUp } from "./../../header/HeaderActions";

export default class EditStory extends Component {

    static blobInstance(byteNumbers) {
        return new Blob([byteNumbers], { "type": "text/html" });
    }

    constructor() {
        super();
        this.state = { "title": "", "body": "" };
        this._onTitleChange = this._onTitleChange.bind(this);
        this._exportHtml = this._exportHtml.bind(this);
        this._saveStory = this._saveStory.bind(this);
        this._showConfirmPopup = this._showConfirmPopup.bind(this);
        this._goBack = (isConfirm) => this._back(isConfirm);
        this.storyId = "";
        this.story = {};
    }

    componentDidMount() {
        this.storyId = this.props.params.storyId;
        if(this.storyId) {
            this._getStory(this.storyId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    autoSave() {
        const STORY_AUTO_SAVE_TIME_INTERVAL = AppWindow.instance().get("storyAutoSaveTimeInterval");
        this.interval = setInterval(() => { this._saveStory(); }, STORY_AUTO_SAVE_TIME_INTERVAL); //eslint-disable-line brace-style
    }

    async _getStory(storyId) {
        const ajax = AjaxClient.instance("/story");
        await ajax.get({ "id": storyId }).then((response) => {
            this.story = response;
            this.setState({ "title": this.story.title });
            this.setState({ "body": this.story.body });
        });
        this.autoSave();
    }

    async _saveStory() {
        const body = this.refs.body.getEditorContents();
        let title = this.state.title;
        if (body && !title && !this.storyId) {
            title = `Untitled_${new Date().getTime()}`;
        }
        this.story.title = title;
        this.story.body = body;

        if(StringUtil.isEmptyString(this.story.title) && StringUtil.isEmptyString(body)) {
            Toast.show(this.storyboardStrings.warningMessages.emptyStory);
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
                if(!this.storyId) {
                    this.storyId = response.id;
                    this.setState({ "title": this.story.title,
                        "body": this.story.body });
                }
                Toast.show(this.storyboardStrings.successMessages.saveStory, "success");
            } catch(error) {
                if(error.message === "Please add title") {
                    Toast.show(error.message);
                } else if(error.message === "Title Already exists") {
                    Toast.show(error.message);
                } else {
                    Toast.show(this.storyboardStrings.errorMessages.saveStoryFailure);
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

    _onTitleChange() {
        this.setState({ "title": this.refs.title.value });
    }

    _back(goBack) {
        let history = History.getHistory();
        if(goBack) {
            history.push("/story-board/stories");
        }
    }
    _showConfirmPopup() {
        const body = this.refs.body.getEditorContents();
        this.setState({ body });
        this.props.route.dispatch(popUp(this.storyboardStrings.confirmStoryBack, this._goBack)); //eslint-disable-line react/prop-types
    }

    render() {
        this.storyboardStrings = Locale.applicationStrings().messages.storyBoard;

        return (
            <div className="story-board story-collections">
                <div className="editor-container">
                    <div className="editor-toolbar">
                        <button className="back" onClick={this._showConfirmPopup}>{this.storyboardStrings.backButton}</button>
                        <ReactQuill.Toolbar key="toolbar" theme="snow" id="toolbar" ref="toolbar" className="ql-toolbar ql-snow"/>
                        <button ref="saveButton" type="submit" className="save" value="save" onClick={this._saveStory}>{this.storyboardStrings.saveButton}</button>
                    </div>
                    <div className="title-bar">
                        <input className="story-title" ref="title" placeholder="please enter title" value={this.state.title} onChange={this._onTitleChange}/>
                    </div>
                    <ReactQuill className="story-editor" theme="snow" ref="body" modules={EditStory.modules} toolbar={false} value={this.state.body}/>
                    <div className="export-container">
                        <i className="fa fa-share export-icon" onClick={this._exportHtml} />
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
    "params": PropTypes.object
};

EditStory.modules = {
    "link-tooltip": true,
    "image-tooltip": true,
    "toolbar": {
        "container": ".ql-toolbar"
    }
};
