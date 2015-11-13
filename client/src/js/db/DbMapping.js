"use strict";
import BoolUtil from "../../../../common/src/util/BoolUtil.js";

class DbMapping {
    static dbType(type) {
        if(!this.dbMapping) {
            this.dbMapping = new DbMapping(type);
        }
        return this.dbMapping;
    }

    DbMapping(type) {
        this.isSupportedDb(type);
        this.type = type;
        this.entityMapping();
    }
    isSupportedDb(type) {
        if(type !== "PouchDB") {
            return new Error("Not a supported db.");
        }
        return true;
    }
    get(entityType) {
        if(BoolUtil.isEmpty(DbMapping.entityMapping[entityType])) {
            throw new Error("database interface type requested not found in the list");
        }
        return this.mapping[entityType];
    }

    entityMapping() {
        this.mapping = {
            "ConfigDb": "ConfigPouchDb",
            "RssFeedConfig": "RssFeedConfigPouchDb"
        };
    }
}