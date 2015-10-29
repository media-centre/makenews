import express from 'express';
import routers from './server/src/routes/Routes';
import routeErrorHandler from "./server/src/routes/RouteErrorHandler.js";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
routers(app);

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/client'));

app.get('/welcome', (req, res) => {
  res.send("welcome");
});

routeErrorHandler(app);
app.listen(port);
export default app;
console.log('listening on port ' + port);