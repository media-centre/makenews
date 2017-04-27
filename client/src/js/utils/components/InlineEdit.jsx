/* Source from :: https://github.com/kaivi/ReactInlineEdit */
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

function selectInputText(element) {
    element.setSelectionRange(0, element.value.length); //eslint-disable-line no-magic-numbers
}
export default class InlineEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "editing": this.props.editing,
            "text": this.props.text,
            "minLength": this.props.minLength,
            "maxLength": this.props.maxLength
        };
        this.startEditing = this.startEditing.bind(this);
        this.finishEditing = this.finishEditing.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.commitEditing = this.commitEditing.bind(this);
        this.clickWhenEditing = this.clickWhenEditing.bind(this);
        this.isInputValid = this.isInputValid.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.textChanged = this.textChanged.bind(this);
    }

    componentWillMount() {
        this.isInputValid = this.props.validate || this.isInputValid;
        // Warn about deprecated elements
        if (this.props.element) { //eslint-disable-next-line no-console
            console.warn("`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component");
        }
    }

    componentWillReceiveProps(nextProps) {
        const isTextChanged = (nextProps.text !== this.props.text);
        const isEditingChanged = (nextProps.editing !== this.props.editing);
        let nextState = {};
        if (isTextChanged) {
            nextState.text = nextProps.text;
        }
        if (isEditingChanged) {
            nextState.editing = nextProps.editing;
        }
        if (isTextChanged || isEditingChanged) {
            this.setState(nextState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let inputElem = ReactDOM.findDOMNode(this.refs.input);
        if (this.state.editing && !prevState.editing) {
            inputElem.focus();
            selectInputText(inputElem);
        } else if (this.state.editing && prevProps.text !== this.props.text) {
            this.finishEditing();
        }
    }

    startEditing(event) {
        if (this.props.stopPropagation) {
            event.stopPropagation();
        }
        this.setState({ "editing": true, "text": this.props.text });
    }

    finishEditing() {
        if (this.isInputValid(this.state.text) && this.props.text !== this.state.text) {
            this.commitEditing();
        } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
            this.cancelEditing();
        }
    }

    cancelEditing() {
        this.setState({ "editing": false, "text": this.props.text });
    }

    commitEditing() {
        this.setState({ "editing": false, "text": this.state.text });
        let newProp = {};
        newProp[this.props.paramName] = this.state.text.trim();
        this.props.change(newProp);
    }

    clickWhenEditing(event) {
        if (this.props.stopPropagation) {
            event.stopPropagation();
        }
    }

    isInputValid(text) {
        return (text.length >= this.state.minLength && text.length <= this.state.maxLength);
    }

    keyDown(event) {
        const ENTER = 13, ESC = 27;
        if (event.keyCode === ENTER) {
            this.finishEditing();
        } else if (event.keyCode === ESC) {
            this.cancelEditing();
        }
    }

    textChanged(event) {
        this.setState({
            "text": event.target.value.trim()
        });
    }

    render() {
        if (this.props.isDisabled) {
            const Element = this.props.element || this.props.staticElement;
            return (
                <Element className={this.props.className} style={this.props.style}>
                    {this.state.text || this.props.placeholder}
                </Element>);
        } else if (!this.state.editing) {
            const Element = this.props.element || this.props.staticElement;
            return (
                <div className={this.props.className}>
                    <Element style={this.props.style}>
                        {this.props.text || this.props.placeholder}
                    </Element>
                    <button className="fa fa-pencil" tabIndex={this.props.tabIndex} onClick={this.startEditing}/>
                </div>);
        }
        const Element = this.props.element || this.props.editingElement;
        return (
            <Element
                onClick={this.clickWhenEditing}
                onKeyDown={this.keyDown}
                onBlur={this.finishEditing}
                className={this.props.activeClassName}
                placeholder={this.props.placeholder}
                defaultValue={this.props.text}
                onChange={this.textChanged}
                style={this.props.style}
                ref="input"
            />);
    }
}

InlineEdit.propTypes = {
    "text": PropTypes.string.isRequired,
    "paramName": PropTypes.string.isRequired,
    "change": PropTypes.func.isRequired,
    "placeholder": PropTypes.string,
    "className": PropTypes.string,
    "activeClassName": PropTypes.string,
    "minLength": PropTypes.number,
    "maxLength": PropTypes.number,
    "validate": PropTypes.func,
    "style": PropTypes.object,
    "editingElement": PropTypes.string,
    "staticElement": PropTypes.string,
    "tabIndex": PropTypes.number,
    "isDisabled": PropTypes.bool,
    "editing": PropTypes.bool,
    "element": PropTypes.string,
    "stopPropagation": PropTypes.bool
};

InlineEdit.defaultProps = {
    "minLength": 2,
    "maxLength": 256,
    "editingElement": "input",
    "staticElement": "span",
    "tabIndex": 0,
    "isDisabled": false,
    "editing": false
};
