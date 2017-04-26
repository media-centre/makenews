import React, { Component } from "react";
import { Link } from "react-router";
import AppSessionStorage from "./../utils/AppSessionStorage";
import Locale from "./../utils/Locale";

export default class WelcomePage extends Component {
    render() {
        const appSessionStorage = AppSessionStorage.instance();
        const user = appSessionStorage.getValue(AppSessionStorage.KEYS.USER_NAME) || "user";
        const welcomeStrings = Locale.applicationStrings().messages.welcomePage;

        return (
            <div className="welcome-page">
                <header>
                    <img className="logo" src="./images/makenews-logo.png" alt="makenews logo" />
                </header>
                <main>
                    <div className="welcome-message">
                        <div className="welcome-user">
                            {welcomeStrings.heading}
                            <span className="username"> {user}</span>,
                        </div>
                        <p className="intro">
                            {welcomeStrings.message}
                        </p>
                    </div>
                </main>
                <footer>
                    <Link to="/configure-intro" className="makenews-desc-link">
                        <span> <i className="fa fa-arrow-right" /> {welcomeStrings.nextButton} </span>
                    </Link>
                </footer>
            </div>
        );
    }
}
