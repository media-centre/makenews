import express from 'express';
import routers from './server/src/routes/Routes';
import routeErrorHandler from "./server/src/routes/RouteErrorHandler.js";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

routers(app);

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/client'));

app.get('/welcome', (req, res) => {
  res.send("welcome");
});

routeErrorHandler(app);
let server = app.listen(port);
export default server;
console.log('listening on port ' + port);