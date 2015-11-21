/*eslint max-len:[0,500] */
"use strict";
import Login from "../components/Login.jsx";
import { userLogin } from "../LoginActions.js";

import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class LoginPage extends Component {

    componentWillMount() {
        document.getElementsByTagName("html")[0].classList.add("login-bg");
    }

    componentWillUnmount() {
        document.getElementsByTagName("html")[0].classList.remove("login-bg");
    }

    render() {
        const { dispatch } = this.props;

        let desc = "", staticBlocks = null, blocks = null;

        desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, sed suscipit tellus. Nunc fringilla euismod felis eget lobortis.";

        staticBlocks = [
            { "url": "images/main/configure.png", "name": "Configure", "description": desc },
            { "url": "images/main/surf.png", "name": "Surf", "description": desc },
            { "url": "images/main/park.png", "name": "Park", "description": desc }
        ];

        blocks = staticBlocks.map((block, index) =>
                <div key={index} className="static-block">
                    <div className="image-block circle blue-bg bottom-box-shadow">
                        <img src={block.url}/>
                    </div>
                    <div className="content-block bottom-box-shadow">
                        <h4>{block.name}</h4>
                        <p className="t-left">{block.description}</p>
                    </div>
                </div>
        );

        return (
            <div>
                <header className="app-header login app-">
                    <div className="clear-fix form-container">
                        <img src="images/main/makenews.png" className="app-logo left clear-fix"/>
                        <div id="login-form-container" className="login-form-container right m-block">
                            <Login ref="login" onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={this.props.errorMessage} />
                        </div>
                    </div>
                    <p className="description small-text">
                {
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, \
                    sed suscipit tellus. Nunc fringilla euismod felis eget lobortis. Duis et maximus turpis, vitae pretium diam. Donec imperdiet fermentum neque sed sollicitudin. In mollis elementum \
                    nisl et faucibus. Proin lectus tortor, facilisis dapibus efficitur eu, vehicula ac orci. Quisque arcu mauris, tempor eu urna nec, interdum venenatis magna. Vestibulum pellentesque \
                    vulputate erat, et sodales sem fringilla nec. Pellentesque sit amet pellentesque elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
                    Sed tincidunt nec nunc a placerat. Suspendisse sodales a sem vitae fermentum. Phasellus elit turpis, bibendum sed suscipit eget, lacinia at justo."
                    }
                    </p>
                </header>

                <section className="login app-section container">
                    <div className="container h-center t-center">{blocks}</div>
                </section>

            </div>

        );
    }
}

LoginPage.displayName = "LoginPage";
LoginPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "errorMessage": PropTypes.string.isRequired
};


function select(store) {
    return store.login;
}
export default connect(select)(LoginPage);
