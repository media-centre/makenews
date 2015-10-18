import {Login} from '../../src/js/login/login_model.js';

describe( 'test', function() {
	it( 'string test is not blank', function() {
		var login = new Login();
		expect(login.isBlank('test')).to.equal(false);
	} );

});
