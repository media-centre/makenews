import 'riot';

export class Login {
  valid(userName, password) {
    if(this.isBlank(userName) || this.isBlank(password)) {
      return false;
    }
    return true;
  }
  isBlank(str) {
      return (!str || /^\s*$/.test(str));
  }
}