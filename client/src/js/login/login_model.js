import 'riot'

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
  test() {
    //testing ES6 code
		let square = x => x * x;
		let add = (a, b) => a + b;
		let pi = () => 3.1415;
  }
}
