import {Login} from '../../src/js/login/login_model.js';

describe( 'test', function() {
	it( 'string test is not blank', function() {
		var login = new Login();
		expect(login.isBlank('test')).to.equal(false);

		//testing ES6 code
		let square = x => x * x;
		let add = (a, b) => a + b;
		let pi = () => 3.1415;
		expect(square(5)).to.equal(25);
		expect(add(3, 4)).to.equal(7);
		expect(pi()).to.equal(3.1415);
	} );

});
