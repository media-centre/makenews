import React from "react";
import { shallow, mount } from "enzyme";
import { assert } from "chai";
import sinon from "sinon";
import Input from "../../../src/js/utils/components/Input";

describe("Input", () => {

    const sandbox = sinon.sandbox.create();

    afterEach("Input", () => {
        sandbox.restore();
    });

    it("should have passed class name", () => {
        const wrapper = shallow(<Input className="cls" placeholder="" />);
        assert.strictEqual(wrapper.node.props.className, "cls");
    });

    it("should contain input container", () => {
        const wrapper = shallow(<Input className="cls" placeholder="" />);
        const container = wrapper.node.props.children;
        assert.strictEqual(container.props.className, "input-container");
    });

    it("should have input element", () => {
        const wrapper = shallow(<Input className="cls" placeholder="type here" />);
        const container = wrapper.node.props.children;
        const [inputElement] = container.props.children;
        assert.strictEqual(inputElement.ref, "input");
        assert.strictEqual(inputElement.props.className, "input-tag");
        assert.strictEqual(inputElement.props.placeholder, "type here");
    });

    it("input on keyup event", () => {
        const callbackSpy = sandbox.spy();
        const wrapper = shallow(<Input className="cls" placeholder="type here" callback={callbackSpy} />);
        const inputElement = wrapper.find("input");
        inputElement.simulate("keyUp", { "keyCode": 70 });
        assert.isTrue(callbackSpy.called);
    });

    it("should not have addOnSrc element", () => {
        const wrapper = shallow(<Input className="cls" placeholder="" />);
        assert.isFalse(wrapper.find("span.input-addon").exists());
    });

    it("addOnSrc element should have icon", () => {
        const wrapper = shallow(<Input className="cls" placeholder="" addonSrc="test" />);
        const addonElement = wrapper.find("span.input-addon");
        const icon = addonElement.node.props.children;
        assert.strictEqual(icon.props.className, "icon fa fa-test");
    });

    it("addOnSrc element on click event", () => {
        const callbackSpy = sandbox.spy();
        const wrapper = shallow(<Input className="cls" placeholder="" addonSrc="test" callback={callbackSpy} />);
        const iconElement = wrapper.find("i.icon.fa.fa-test");
        iconElement.simulate("click");
        assert.isTrue(callbackSpy.called);
    });

    it("callbackOnEnter callback should be called", () => {
        const callbackSpy = sandbox.spy();
        const wrapper = mount(<Input className="cls" placeholder="" callbackOnEnter callback={callbackSpy} />);
        const inputElement = wrapper.find("input");
        inputElement.simulate("keyUp", { "keyCode": 13 });
        assert.isTrue(callbackSpy.called);
    });

});
