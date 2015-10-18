import {Login} from '../../src/login/login.js';

describe( 'test', function() {
	it( 'return one', function() {
		var login = new Login();
    expect(login.valid()).to.equal(1);
	} );

});
