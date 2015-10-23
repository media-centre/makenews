import { Session } from './session.js';

export function loginPresenter() {
  if(localStorage.getItem("user") === null) {
    riot.mount("login", {session_model: Session});
  }
  else {
    riot.mount("home");
  }
}