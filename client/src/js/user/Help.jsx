/* eslint react/no-danger:0 */
import React, { Component } from "react";
import Locale from "../utils/Locale";
import R from "ramda"; //eslint-disable-line id-length

export default class Help extends Component {
    displayFAQs() {
        const faqDom = (faq, index) =>
            (<div className="FAQ" key={index}>
                <h4 className="question">{faq.question}</h4>
                <p className="answer" dangerouslySetInnerHTML={{ "__html": faq.answer }} />
            </div>);
        const mapIndex = R.addIndex(R.map);

        return mapIndex(faqDom, this.messages.FAQs);
    }

    render() {
        this.messages = Locale.applicationStrings().messages.helpFAQs;
        return(
            <div className="help-FAQs">
                <div className="help">
                    <h3>{this.messages.help}</h3>
                    <div className="video" dangerouslySetInnerHTML={{ "__html": "<iframe class='video-play' src='https://www.youtube.com/embed/KrDjm5Mwv8Y?ecver=2'></iframe>" }} />
                </div>
                <div className="FAQs">
                    <h3>{this.messages.FAQsHeading}</h3>
                    {this.displayFAQs()}
                </div>
            </div>);
    }
}
