import AllUrlHelper from "./helpers/AllUrlHelper.js";
import LoginRouteHelper from "./helpers/LoginRouteHelper.js";

export default (app) => {
  app.post('/login', (request, response) => {
      LoginRouteHelper.loginCallback(request, response);
  });

  app.use((request, response, next) => {
      AllUrlHelper.allUrlsCallback(request, next);
  });
}
