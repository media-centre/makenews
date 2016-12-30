import StringUtil from "../../../common/src/util/StringUtil";
import crypto from "crypto";
import ApplicationConfig from "../../../server/src/config/ApplicationConfig";

export default class CryptUtil {
    static hmac(algorithm, key, digest, data) {
        if(StringUtil.isEmptyString(algorithm) || StringUtil.isEmptyString(key) || StringUtil.isEmptyString(digest)) {
            throw new Error("algorithm or key or digest can not be empty");
        }

        let appSecretProof = crypto.createHmac(algorithm, key);
        appSecretProof.setEncoding(digest);
        if(data) {
            appSecretProof.write(data);
        }
        appSecretProof.end();
        return appSecretProof.read();
    }
    
    static dbNameHash(dbName) {
        return `${ApplicationConfig.instance().userDbPrefix()}${crypto.createHmac("sha256", dbName).digest("hex")}`;
    }
}
