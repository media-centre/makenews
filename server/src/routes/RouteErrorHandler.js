"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";

export default function(app) {
    app.use((err, req, res, next) => {
        if(err.status !== HttpResponseHandler.codes.UNAUTHORIZED) {
            return next();
        }
        res.status(HttpResponseHandler.codes.UNAUTHORIZED);
        res.send("Unauthorised");
    });

}
