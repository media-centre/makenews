import React, { Component } from "react";
import PropTypes from "prop-types";
import Toast from "../../utils/custom_templates/Toast";
import History from "../../History";
import StringUtil from "../../../../../common/src/util/StringUtil";
import NewsBoardTabs from "./../../newsboard/components/NewsBoardTabs";
import FeedContainer from "./../../newsboard/components/FeedContainer";
import FileSaver from "file-saver";
import AppWindow from "./../../utils/AppWindow";
import Locale from "./.././../utils/Locale";
import { popUp } from "./../../header/HeaderActions";
import { getStory, saveStory } from "./../actions/StoryBoardActions";

export default class EditStory extends Component {
    static blobInstance(byteNumbers) {
        return new Blob([byteNumbers], { "type": "text/html" });
    }

    static quillEditor(text) {
        if(!EditStory.editor) {
            EditStory.editor = require("react-quill"); //eslint-disable-line global-require
        }
        return <EditStory.editor className="story-editor" theme="snow" ref="body" modules={EditStory.modules} value={text}/>;
    }

    constructor() {
        super();
        this.state = { "title": "", "body": "" };
        this._exportHtml = this._exportHtml.bind(this);
        this._saveStory = this._saveStory.bind(this);
        this._showConfirmPopup = this._showConfirmPopup.bind(this);
        this._goBack = (isConfirm) => this._back(isConfirm);
        this._navBarRef = this._navBarRef.bind(this);
    }

    componentDidMount() {
        const storyId = this.props.params.storyId;
        if(storyId) {
            this._getStory(storyId);
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
        const response = await getStory(storyId);
        if(response) {
            const { _id, _rev, title, body } = response;
            this.setState({ _id, _rev, title, body });
            this.refs.title.value = title;
        }
        this.autoSave();
    }

    async _saveStory() {
        const body = this.refs.body.getEditorContents();
        let title = this.refs.title.value;

        if(!this.isStoryUpdated()) {
            return;
        }
        if (body && !title && !this.state._id) {
            title = `Untitled_${new Date().getTime()}`;
            this.refs.title.value = title;
        }

        if(StringUtil.isEmptyString(title) && StringUtil.isEmptyString(body)) {
            Toast.show(this.storyboardStrings.warningMessages.emptyStory);
        } else {
            const { _id, _rev } = this.state;
            const saveStoryResponse = await saveStory({ _id, _rev, title, body });
            if(saveStoryResponse) {
                if(!this.state._id) {
                    this.autoSave();
                }
                const response = { "_id": saveStoryResponse.id, "_rev": saveStoryResponse.rev, title, body };
                this.setState(response);
                Toast.show(this.storyboardStrings.successMessages.saveStory, "save-story", this.refs.saveButton);
            }
        }
    }

    _exportHtml() {
        const htmlString = `<html style="line-height: 1.5rem;"><body><h1>${this.state.title}</h1>${this.state.body}</body></html>`;
        const byteNumbers = new Uint8Array(htmlString.length);
        [...htmlString].map((htmlChar, index) => {
            byteNumbers[index] = htmlChar.charCodeAt();
        });
        const blob = EditStory.blobInstance(byteNumbers);
        FileSaver.saveAs(blob, `${this.state.title}.html`);
    }

    _back(goBack) {
        const history = History.getHistory();
        if(goBack) {
            history.push("/story-board/stories");
        }
    }

    isStoryUpdated() {
        const body = this.refs.body.getEditorContents();
        return this.state.body !== body || this.state.title !== this.refs.title.value;
    }

    _showConfirmPopup() {
        if(this.isStoryUpdated()) {
            this.props.route.dispatch(popUp(this.storyboardStrings.confirmStoryBack, this._goBack));
        } else {
            this._goBack(true);
        }
    }

    _navBarRef() {
        return this.refs.storyBoardNavBar;
    }

    render() {
        this.storyboardStrings = Locale.applicationStrings().messages.storyBoard;
        return (
            <div className="story-board story-collections">
                <div className="editor-container">
                    <div className="editor-toolbar">
                        <button className="back" onClick={this._showConfirmPopup}>{this.storyboardStrings.backButton}</button>
                        <div id="toolbar" className="ql-toolbar">
                            <select className="ql-font" />
                            <select className="ql-size" />
                            <select className="ql-align" />
                            <button className="ql-bold" />
                            <button className="ql-italic" />
                            <button className="ql-strike" />
                            <button className="ql-underline" />
                            <select className="ql-color" />
                            <select className="ql-background" />
                            <button className="ql-link" />
                            <button className="ql-list" value="bullet" />
                            <button className="ql-list" value="ordered" />
                            <button className="ql-image" />
                        </div>
                        <button ref="saveButton" type="submit" className="save" value="save" onClick={this._saveStory}>{this.storyboardStrings.saveButton}</button>
                    </div>
                    <div className="title-bar">
                        <input className="story-title" ref="title" placeholder="please enter title" autoFocus />
                    </div>
                    {EditStory.quillEditor(this.state.body)}
                    <div className="export-container">
                        <i className="fa fa-share export-icon" onClick={this._exportHtml} />
                    </div>
                </div>

                <FeedContainer navBar={this._navBarRef}/>

                <div className="source-type-bar" ref="storyBoardNavBar">
                    <NewsBoardTabs />
                </div>
            </div>
        );
    }
}

EditStory.propTypes = {
    "params": PropTypes.object,
    "route": PropTypes.object
};

EditStory.modules = {
    "toolbar": {
        "container": ".ql-toolbar"
    }
};
