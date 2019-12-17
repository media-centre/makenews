export function mockResponse() {
    let responseStatus = null;
    let responseJson = null;
    return {
        "status": (status) => {
            if(status) {
                responseStatus = status;
            }
            return responseStatus;
        },
        "json": (jsonData) => {
            if(jsonData) {
                responseJson = jsonData;
            }
            return responseJson;
        }
    };
}
