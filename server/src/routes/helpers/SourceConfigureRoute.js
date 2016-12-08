import StringUtil from "../../../../common/src/util/StringUtil";
import SourceConfigRequestHandler from "../../sourceConfig/SourceConfigRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import R from "ramda"; //eslint-disable-line id-length

export default class SourceConfigureRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }
    }

    _checkRequiredParams(params) {
        if(R.any(StringUtil.isEmptyString)(params)) {
            RouteLogger.instance().warn("SourceConfigureRoute:: invalid route");
            this._handleInvalidRoute();
        }
    }

    fetchConfiguredSources() {
        this._checkRequiredParams([this.authSession]);
        SourceConfigRequestHandler.instance().fetchConfiguredSources(this.authSession).then(sources => {
            RouteLogger.instance().debug("SourceConfigureRoute:: successfully fetched configured sources");
            this._handleSuccess(sources);
        }).catch(error => {
            RouteLogger.instance().error(`SourceConfigureRoute:: fetching configured sources failed. Error: ${error}`);
            this._handleBadRequest();
        });
    }
}
