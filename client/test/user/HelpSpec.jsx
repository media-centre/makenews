import Help from "./../../src/js/user/Help";
import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

describe("Help", () => {
    let helpDom = null;
    beforeEach("Help", () => {
        helpDom = shallow(<Help />);
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
        const [, FAQs] = helpDom.node.props.children;
        expect(FAQs.type).to.equals("div");
        expect(FAQs.props.className).to.equals("FAQs");
    });

    it("should have heading FAQs", () => {
        const [, FAQs] = helpDom.node.props.children;
        const [heading] = FAQs.props.children;
        expect(heading.type).to.equals("h3");
        expect(heading.props.children).to.equals("FAQs");
    });

    it("FAQs should have question and answers", () => {
        const [, FAQs] = helpDom.node.props.children;
        const [, questions] = FAQs.props.children;
        const [question] = questions.props.children;
        const [, answer] = questions.props.children;

        expect(questions.type).to.equals("div");
        expect(questions.props.className).to.equals("FAQ");
        expect(question.type).to.equals("h4");
        expect(question.props.className).to.equals("question");
        expect(answer.type).to.equals("p");
        expect(answer.props.className).to.equals("answer");
    });
});
