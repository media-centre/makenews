import React, { Component } from "react";
import StoryEditor from "./StoryEditor";

export default class EditStory extends Component {
    render() {
        return (
            <div className="story-board">
                <div className="collections">
                    <h1>Collections</h1>
                </div>
                <StoryEditor />
            </div>
        );
    }
}
