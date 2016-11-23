import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";

export default function(app) {
    app.use((err, req, res, next) => { //eslint-disable-line consistent-return
        if(err.status !== HttpResponseHandler.codes.UNAUTHORIZED) {
            return next();
        }
        res.status(HttpResponseHandler.codes.UNAUTHORIZED);
        res.send(err);
    });

}
