import Login from '../components/Login.jsx';
import React, { Component } from 'react';
import { connect} from 'react-redux';
import { userLogin } from '../Actions';

export default class LoginPage extends Component {
  render() {
    const { dispatch} = this.props;

    return (
      <div>
        <header className="app-header login app-">
            <div className="clear-fix form-container">
                <div className="app-logo left clear-fix extra-large-text">
                    <span className="left">make</span>
                    <b className="left">news</b>
                </div>
                <div id="login-form-container" className="login-form-container right m-block">
                  <Login id='login' ref='login' onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={this.props.errorMessage} />
                </div>
            </div>
            <p className="description small-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel faucibus lectus, quis rutrum sem. Quisque lobortis viverra sagittis. Pellentesque vitae tristique dolor, sed suscipit tellus. Nunc fringilla euismod felis eget lobortis. Duis et maximus turpis, vitae pretium diam. Donec imperdiet fermentum neque sed sollicitudin. In mollis elementum nisl et faucibus. Proin lectus tortor, facilisis dapibus efficitur eu, vehicula ac orci.
                Quisque arcu mauris, tempor eu urna nec, interdum venenatis magna. Vestibulum pellentesque vulputate erat, et sodales sem fringilla nec. Pellentesque sit amet pellentesque elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed tincidunt nec nunc a placerat. Suspendisse sodales a sem vitae fermentum. Phasellus elit turpis, bibendum sed suscipit eget, lacinia at justo.
            </p>
        </header>

        <section className="login app-section">
            <img src="images/newspaper.jpg" alt="banner image"/>
        </section>
      </div>

    );
  }
}

function select(store) {
  return store.login;
}
export default connect(select)(LoginPage);
