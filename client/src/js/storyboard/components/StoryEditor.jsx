import React, { Component } from "react";
import { Editor, EditorState, RichUtils, CompositeDecorator } from "draft-js";

export default class StoryEditor extends Component {

    constructor() {
        super();

        const decorator = new CompositeDecorator([
            {
                "strategy": this._findLinkEntities,
                "component": this.Link
            }
        ]);

        this.state = { "editorState": EditorState.createEmpty(decorator), "showUrlInput": false };
        this._updateEditor = this._updateEditor.bind(this);
        this._handleKeyCommand = this._handleKeyCommand.bind(this);
        this._onTab = this._onTab.bind(this);
        this._handleEnter = this._handleEnter.bind(this);
    }

    componentDidMount() {
        this._focusEditor();
    }

    _updateEditor(editorState) {
        this.setState({ editorState });
    }

    _handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this._updateEditor(newState);
            return true;
        }
        return false;
    }

    _focusEditor() {
        this.refs.editor.focus();
    }

    _toggleInlineStyle(inlineStyle) {
        this._updateEditor(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
        this._focusEditor();
    }

    _toggleBlockStyle(blockType) {
        this._updateEditor(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
        this._focusEditor();
    }


    Link(props) {
        const { url } = props.contentState.getEntity(props.entityKey).getData();
        return (<a href={url} className="editor__link" target="_blank" rel="noopener noreferrer">{ props.children }</a>);
    }

    _findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === "LINK"
                );
            },
            callback
        );
    }

    _handleEnter(event) {
        const ENTER = 13;
        if (event.keyCode === ENTER) {
            this._addLink(this.refs.url.value);
        }
    }

    _addLink(url) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            "LINK",
            "MUTABLE",
            { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { "currentContent": contentStateWithEntity });
        this.setState({
            "editorState": RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            ),
            "showURLInput": false
        }, () => {
            setTimeout(() => this.refs.editor.focus());
        });
    }

    _showLinkPrompt() {
        this.setState({ "showUrlInput": true });
    }

    _onTab(event) {
        const maxDepth = 4;
        const state = this.state.editorState;
        this._updateEditor(RichUtils.onTab(event, state, maxDepth));
    }

    render() {
        return (
            <div className="story-editor-container">
                <div className="story-editor__controls">
                    <i className="icon fa fa-bold" onMouseDown = {() => {
                        this._toggleInlineStyle("BOLD");
                    }}
                    />
                    <i className="icon fa fa-italic" onMouseDown = {() => {
                        this._toggleInlineStyle("ITALIC");
                    }}
                    />
                    <i className="icon fa fa-underline" onMouseDown = {() => {
                        this._toggleInlineStyle("UNDERLINE");
                    }}
                    />
                    <i className="icon fa fa-list-ol" onMouseDown = {() => {
                        this._toggleBlockStyle("ordered-list-item");
                    }}
                    />
                    <i className="icon fa fa-list-ul" onMouseDown = {() => {
                        this._toggleBlockStyle("unordered-list-item");
                    }}
                    />
                    <i className="icon fa fa-chain" onMouseDown = {() => {
                        this._showLinkPrompt();
                    }}
                    />
                    { this.state.showUrlInput && <input ref="url" placeholder="Enter Url" onKeyDown={this._handleEnter}/> }
                </div>
                <div className="story-editor">
                    <Editor
                        ref="editor"
                        spellCheck
                        editorState = {this.state.editorState}
                        handleKeyCommand = {this._handleKeyCommand}
                        onChange = {this._updateEditor}
                        onTab={this._onTab}
                    />
                </div>
            </div>
        );
    }
}
