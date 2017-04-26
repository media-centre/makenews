import React, { Component } from "react";
import History from "../History";
import Locale from "./../utils/Locale";

export default class ConfigurationIntro extends Component {
    render() {
        const configurationIntroStrings = Locale.applicationStrings().messages.configurationIntro;
        return (
            <div className="welcome-page">
                <header>
                    <img className="logo" src="./images/makenews-logo.png" alt="makenews logo" />
                </header>
                <main>
                    <div className="welcome-message">
                        <p className="intro">
                            {configurationIntroStrings.introMessage}
                        </p>
                        <div className="sources">
                            <span className="source">
                                <i className="fa fa-web" /> {configurationIntroStrings.web}
                            </span>
                            <span className="source">
                                <i className="fa fa-facebook" /> {configurationIntroStrings.facebook}
                            </span>
                            <span className="source">
                                <i className="fa fa-twitter" /> {configurationIntroStrings.twitter}
                            </span>
                        </div>
                    </div>
                </main>
                <footer>
                    <button className="makenews-desc-link" onClick={() => History.getHistory().push("/configure/web")}>
                        <span> <i className="fa fa-arrow-right" /> {configurationIntroStrings.getStarted} </span>
                    </button>
                </footer>
            </div>
        );
    }
}
