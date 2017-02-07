import React, { Component } from "react";
import ReactQuill from "react-quill";

export default class StoryEditor extends Component {

    constructor() {
        super();
        this.state = { "editorContent": "something" };
        this._onChange = this._onChange.bind(this);
    }

    _onChange(value) {
        this.setState({ "editorContent": value });
    }

    render() {
        return (
            <ReactQuill className = "story-editor-container" value={this.state.editorContent} onChange={this._onChange} theme="snow"/>
        );
    }
}
