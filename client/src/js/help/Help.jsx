"use strict";

import React, { Component } from "react";

export default class Help extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="help-container">
                <h3 className="t-center t-bold"> {"Help"} </h3>
                <div className="help">
                    <div className="help-box help-youtube">
                        <iframe src="https://www.youtube.com/embed/vbklyvS9VnA" frameBorder="0" allowFullScreen>{"Video"}</iframe>
                        <div className="t-center help-text">
                            <i className="fa fa-youtube fa-3x"></i>
                        </div>
                    </div>
                    <div className="help-box help-slide">
                        <iframe src="//www.slideshare.net/slideshow/embed_code/key/eviKUGwN09K1u7" frameBorder="0" allowFullScreen>{"PDF"}</iframe>
                        <div className="t-center help-text">
                            <i className="fa fa-file-pdf-o fa-3x"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Help.displayName = "Help";
