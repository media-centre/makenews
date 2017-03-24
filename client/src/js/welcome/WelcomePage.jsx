import React, { Component } from "react";
import { Link } from "react-router";
import AppSessionStorage from "./../utils/AppSessionStorage";

export default class WelcomePage extends Component {
    render() {
        const appSessionStorage = AppSessionStorage.instance();
        const user = appSessionStorage.getValue(AppSessionStorage.KEYS.USER_NAME) || "user";
        return (
            <div className="welcome-page">
                <header>
                    <img className="logo" src="./images/makenews-logo.png" alt="makenews logo" />
                </header>
                <main>
                    <div className="welcome-message">
                        <div className="welcome-user">
                            Hello
                            <span className="username"> {user}</span>,
                        </div>
                        <p className="intro">
                            Welcome onboard. Hungry for news? Lets get started to collect and sort your news at one stop. Here are a few things you might want to know.
                        </p>
                    </div>
                </main>
                <footer>
                    <Link to="/configure-intro" className="makenews-desc-link">
                        <span> <i className="fa fa-arrow-right" /> Next </span>
                    </Link>
                </footer>
            </div>
        );
    }
}
