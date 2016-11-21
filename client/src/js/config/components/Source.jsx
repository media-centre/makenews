/* eslint-disable operator-linebreak */
import React, { Component, PropTypes } from "react";
import { addFacebookProfile } from "./../actions/FacebookConfigureActions";

export default class Source extends Component {
    render() {
        return (
            <div className={this.props.source.added ? "source added" : "source"}>
                <div className="source__icon">
                    <img src={this.props.source.picture.data.url} />
                </div>
                <div className="source__title">
                    { this.props.source.name }
                </div>
                { this.props.source.added ?
                    (<div className="source__added-icon source__action-icon">
                        <img src="./images/success-arrow.png"/>
                    </div>)
                    :
                    (<div className="source__add-icon source__action-icon" onClick={() => this.props.dispatch(addFacebookProfile(this.props.source))}>
                        <img src="./images/add-btn.png"/>
                    </div>)
                }
            </div>
        );
    }
}

Source.propTypes = {
    "source": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};
