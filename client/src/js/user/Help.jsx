import React, { Component } from "react";

export default class Help extends Component {
    render() {
        return(
            <div className="help-FAQs">
                <div className="help">
                    <h3>Help</h3>
                    <div className="video">
                        <i className="icon fa fa-play" aria-hidden="true"/>
                    </div>
                </div>
                <div className="FAQs">
                    <h3>FAQs</h3>
                    <div className="FAQ">
                        <h4 className="question">What is the main purpose of the application?</h4>
                        <p className="answer">
                            To act as an aggregator for news items from different
                            sources like RSS feeds, Facebook Page and Twitter Handles or Hashtags.
                        </p>
                    </div>
                </div>
            </div>);
    }
}
