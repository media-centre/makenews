import React, { Component } from "react";
import ReactQuill from "react-quill";

export default class StoryEditor extends Component {

    constructor() {
        super();
        this.state = { "editorContent": "" };
        this._onChange = this._onChange.bind(this);
    }

    _onChange(value) {
        this.setState({ "editorContent": value });
    }

    render() {
        return (
            <div className="story-editor-container">
            <ReactQuill className = "story-editor" placeholder = "Write a story" value={this.state.editorContent} onChange={this._onChange} theme="snow"/>
            </div>
        );
    }
}
