"use strict";

import React, { Component } from "react";

export default class Help extends Component {
    render() {
        return (
            <div>
                <div> {"Help"} </div>
                <div>
                    <div>
                        <iframe src="https://www.youtube.com/embed/UCXGei8H1W8" frameBorder="0" allowFullScreen>{"Video"}</iframe>
                    </div>
                    <div>
                        <iframe src="//www.slideshare.net/slideshow/embed_code/key/3uMZsTkvjU99xY" frameBorder="0" allowFullScreen>{"PDF"}</iframe>
                    </div>
                </div>
            </div>
        );
    }
}

Help.displayName = "Help";
