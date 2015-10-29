import express from 'express';
import routers from './server/routes/Routes';

let app = express();
routers(app);

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/client'));

export let server = app.listen(port);
console.log('listening on port ' + port);
