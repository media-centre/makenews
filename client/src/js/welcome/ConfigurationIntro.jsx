import React, { Component } from "react";
import { Link } from "react-router";

export default class ConfigurationIntro extends Component {
    render() {
        return (
            <div className="welcome-page">
                <header>
                    <img className="logo" src="./images/makenews-logo.png" alt="makenews logo" />
                </header>
                <main>
                    <div className="welcome-message">
                        <p className="intro">
                            To view your news at one stop you can configure all your key sources and aggregate them on Makenews.
                        </p>
                        <div className="sources">
                            <span className="source">
                                <i className="fa fa-web" /> Web
                            </span>
                            <span className="source">
                                <i className="fa fa-facebook" /> Facebook
                            </span>
                            <span className="source">
                                <i className="fa fa-twitter" /> Twitter
                            </span>
                        </div>
                    </div>
                </main>
                <footer>
                    <Link to="/configure/web" className="makenews-desc-link">
                        <span> <i className="fa fa-arrow-right" /> Get Started </span>
                    </Link>
                </footer>
            </div>
        );
    }
}
