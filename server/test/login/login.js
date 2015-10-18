import {Login} from '../../src/login/login.js';

describe( 'test', function() {
	it( 'return one', function() {
		var login = new Login();
    expect(login.valid()).to.equal(1);

		//testing ES6 code
		let square = x => x * x;
		let add = (a, b) => a + b;
		let pi = () => 3.1415;
		expect(square(5)).to.equal(25);
		expect(add(3, 4)).to.equal(7);
		expect(pi()).to.equal(3.1415);
	} );

});
