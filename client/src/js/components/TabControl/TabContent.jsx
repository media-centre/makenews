"use strict";
import React, { Component, PropTypes } from "react";
import {addRssUrlAsync} from "../../Actions.js";

export default class TabContent extends Component {

    _onUrlChange() {
        console.log("changed");
    }

    firstTextBoxKeyDown(event, props) {
        const ENTERKEY=13;
        if(event.keyCode === ENTERKEY){
            props.dispatch(addRssUrlAsync(props.categoryName, this.refs.addUrlTextBox1.value.trim()));
        }
    }

    secondTextBoxKeyDown(event, props) {
        const ENTERKEY=13;
        if(event.keyCode === ENTERKEY){
            console.log(this.refs.addUrlTextBox2.value.trim());
        }
    }

    render() {
        console.log("this.props.content = ");
        console.log(this.props.content.details);
        return (
            <div>
                <div className="nav-control h-center">
                    <i className="fa fa-plus"></i><span>{"Add Url"}</span>
                </div>
                <div className="url-panel">
                    <ul classaName="url-list">
                                {this.props.content.details.map((url, index) =>
                                        <li key={index} className="feed-url">
                                            <input type="text" value={url} onChange={this._onUrlChange} />
                                            <i className="border-blue circle fa fa-close close circle"></i>
                                        </li>
                                )}
                    </ul>
                    <input type="text" ref="addUrlTextBox1" className="add-url-input box border-blue" placeholder="Enter url here" onKeyDown={(event) => this.firstTextBoxKeyDown(event, this.props)}/>
                    <input type="text" ref="addUrlTextBox2" className="add-url-input box border-blue" placeholder="Enter url here" onKeyDown={(event) => this.secondTextBoxKeyDown(event, this.props)}/>
                </div>
            </div>
        );
    }
}

TabContent.displayName = "Tab Control";

