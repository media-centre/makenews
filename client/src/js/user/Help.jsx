import React, { Component } from "react";
import Locale from "../utils/Locale";
import R from "ramda"; //eslint-disable-line id-length

export default class Help extends Component {
    displayFAQs() {
        const faqDom = (faq, index) =>
            (<div className="FAQ" key={index}>
                <h4 className="question">{faq.question}</h4>
                <p className="answer">{faq.answer}</p>
            </div>);
        const mapIndex = R.addIndex(R.map);
        const appEn = Locale.applicationStrings();
        return mapIndex(faqDom, appEn.messages.FAQs);
    }

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
                    {this.displayFAQs()}
                </div>
            </div>);
    }
}
