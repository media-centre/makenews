import { customAjax } from '../../src/js/utils/AjaxRequest';

describe('customAjax', () => {
    var sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should post to url with proper params', (done) => {
        let result;
        let successCallback = function(data) {
           result = "success";
        };

        let failureCallback = function(data) {
           result = "success";
        };
        let promise = customAjax.request({"method": "POST", "url": "/xxx",
            "data": {"username": "u", "password": "p"}, "success": successCallback, "failure": failureCallback})

        let xmlHttpRequestSpy = sandbox.spy(XMLHttpRequest.prototype);
        expect(xttp.send).calledOnce.withArg({})
    });

    xit('should post to url and return json on success', (done) => {
        let result;
        let successCallback = function(data) {
           result = "success";
        };

        let failureCallback = function(data) {
           result = "success";
        };
        let promise = customAjax.request({"method": "POST", "url": "/xxx",
            "data": {"username": "u", "password": "p"}, "success": successCallback, "failure": failureCallback})

        promise.then(() => {
           expect(result).to.equal("success");
           done();
        });
    });


});