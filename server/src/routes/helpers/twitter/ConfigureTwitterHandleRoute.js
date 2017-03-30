import TwitterRequestHandler from "./../../../twitter/TwitterRequestHandler";
import Route from "./../Route";

export default class ConfigureTwitterHandleRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.twitterHandle = this.request.body.twitterHandle;
    }

    validate() {
        return super.validate(this.twitterHandle);
    }

    async handle() {
        return await TwitterRequestHandler.instance().configureTwitterHandle(this.accessToken, this.twitterHandle);
    }
}
