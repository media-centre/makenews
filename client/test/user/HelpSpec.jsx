import Help from "./../../src/js/user/Help";
import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import Locale from "./../../src/js/utils/Locale";
import sinon from "sinon";

describe("Help", () => {
    let helpDom = null, FAQs = null;
    const sandbox = sinon.sandbox.create();
    beforeEach("Help", () => {
        FAQs = [{
            "question": "What is the purpose of the application?",
            "answer": "To act as an aggregator for news items from different sources like RSS feeds, Facebook Page and Twitter Handles or Hashtags"
        }];
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "FAQs": [{
                    "question": "question",
                    "answer": "answer"
                }]
            }
        });
        helpDom = shallow(<Help FAQs={FAQs}/>);
    });

    afterEach("Help", () => {
        sandbox.restore();
    });

    it("should have help&FAQs div", () => {
        expect(helpDom.node.type).to.equals("div");
        expect(helpDom.node.props.className).to.equals("help-FAQs");
    });

    it("should have help div", () => {
        const [help] = helpDom.node.props.children;
        expect(help.type).to.equals("div");
        expect(help.props.className).to.equals("help");
    });

    it("should have video", () => {
        const [help] = helpDom.node.props.children;
        const [, video] = help.props.children;
        expect(video.type).to.equals("div");
        expect(video.props.className).to.equals("video");
        expect(video.props.children.type).to.equals("i");
        expect(video.props.children.props.className).to.equals("icon fa fa-play");
    });

    it("should have heading help", () => {
        const [help] = helpDom.node.props.children;
        const [heading] = help.props.children;
        expect(heading.type).to.equals("h3");
        expect(heading.props.children).to.equals("Help");
    });

    it("should have FAQs div", () => {
        const [, FAQS] = helpDom.node.props.children;
        expect(FAQS.type).to.equals("div");
        expect(FAQS.props.className).to.equals("FAQs");
    });

    it("should have heading FAQs", () => {
        const [, FAQS] = helpDom.node.props.children;
        const [heading] = FAQS.props.children;
        expect(heading.type).to.equals("h3");
        expect(heading.props.children).to.equals("FAQs");
    });

    it("FAQs should have question and answers", () => {
        const questions = helpDom.find(".FAQs");
        const [, faq] = questions.node.props.children;
        const [question, answer] = faq[0].props.children; //eslint-disable-line no-magic-numbers

        expect(question.type).to.equals("h4");
        expect(question.props.className).to.equals("question");
        expect(answer.type).to.equals("p");
        expect(answer.props.className).to.equals("answer");
    });
});
