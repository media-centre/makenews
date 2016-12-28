import StringUtil from "../../../../common/src/util/StringUtil";
import SourceConfigRequestHandler from "../../sourceConfig/SourceConfigRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import R from "ramda"; //eslint-disable-line id-length
import { sourceTypes } from "../../util/Constants";

export default class SourceConfigureRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }

        if(this.request.body) {
            this.sources = this.request.body.sources;
            this.type = this.request.body.type;
        }
    }

    _checkRequiredParams(params) {
        if(R.any(StringUtil.isEmptyString)(params)) {
            RouteLogger.instance().warn("SourceConfigureRoute:: invalid route");
            this._handleInvalidRequest("authentication failed");
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

    async addConfiguredSource() {
        let sourceType = sourceTypes[this.type];
        if(R.any(StringUtil.isEmptyString)([sourceType, this.authSession])) {
            RouteLogger.instance().warn(`SourceConfigureRoute:: invalid sourceType ${this.type} or authentication failed`);
            this._handleInvalidRequest({ "message": "invalid Source Type" });
        } else {
            try {
                let status = await SourceConfigRequestHandler.instance().addConfiguredSource(sourceType, this.sources, this.authSession);
                RouteLogger.instance().debug("SourceConfigureRoute:: successfully added configured source to db");
                this._handleSuccess(status);
            } catch (error) {
                RouteLogger.instance().error(`SourceConfigureRoute:: Error adding configured source. Error: ${error}`);
                this._handleBadRequest();
            }
        }
    }
}
