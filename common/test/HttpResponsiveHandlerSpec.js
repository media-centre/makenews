import HttpResponseHandler from '../src/HttpResponseHandler.js';
import { assert, expect } from 'chai';

describe('information', () => {
    it('should return true if the status code is 100', () => {
        const infoStart=100;
        expect(new HttpResponseHandler(infoStart).information()).to.be.ok;
    });

    it('should return true if the status code is 199', () => {
        const infoEnd=199;
        expect(new HttpResponseHandler(infoEnd).information()).to.be.ok;
    });

    it('should return true if the status code is 150', () => {
        const infoBetween = 150;
        expect(new HttpResponseHandler(infoBetween).information()).to.be.ok;
    });


});

describe('success', () => {
    it('should return true if the status code is 200', () => {
        const successStart=200;
        expect(new HttpResponseHandler(successStart).success()).to.be.ok;
    });

    it('should return true if the status code is 299', () => {
        const successEnd=299;
        expect(new HttpResponseHandler(successEnd).success()).to.be.ok;
    });

    it('should return true if the status code is 250', () => {
        const successBetween = 250;
        expect(new HttpResponseHandler(successBetween).success()).to.be.ok;
    });
});


describe('redirection', () => {
    it('should return true if the status code is 300', () => {
        const redirectionStart=300;
        expect(new HttpResponseHandler(redirectionStart).redirection()).to.be.ok;
    });

    it('should return true if the status code is 399', () => {
        const redirectionEnd=399;
        expect(new HttpResponseHandler(redirectionEnd).redirection()).to.be.ok;
    });

    it('should return true if the status code is 350', () => {
        const redirectionBetween = 350;
        expect(new HttpResponseHandler(redirectionBetween).redirection()).to.be.ok;
    });
});

describe('clientError', () => {
    it('should return true if the status code is 400', () => {
        const clientErrorStart=400;
        expect(new HttpResponseHandler(clientErrorStart).clientError()).to.be.ok;
    });

    it('should return true if the status code is 499', () => {
        const clientErrorEnd=499;
        expect(new HttpResponseHandler(clientErrorEnd).clientError()).to.be.ok;
    });

    it('should return true if the status code is 450', () => {
        const clientErrorBetween = 450;
        expect(new HttpResponseHandler(clientErrorBetween).clientError()).to.be.ok;
    });
});

describe('serverError', () => {
    it('should return true if the status code is 500', () => {
        const serverErrorStart=500;
        expect(new HttpResponseHandler(serverErrorStart).serverError()).to.be.ok;
    });

    it('should return true if the status code is 599', () => {
        const serverErrorEnd=599;
        expect(new HttpResponseHandler(serverErrorEnd).serverError()).to.be.ok;
    });

    it('should return true if the status code is 550', () => {
        const serverErrorBetween = 550;
        expect(new HttpResponseHandler(serverErrorBetween).serverError()).to.be.ok;
    });
});

describe('is', () => {
    it('should return true if 404 is resource not found', () => {
        const resourceNotFound=404;
        expect(new HttpResponseHandler(HttpResponseHandler.codes.NOT_FOUND).is(resourceNotFound)).to.be.ok;
    });

    it('should return false if 404 is not internal server error', () => {
        const internalServerError=500;
        expect(new HttpResponseHandler(HttpResponseHandler.codes.NOT_FOUND).is(internalServerError)).to.be.not.ok;
    });

});
