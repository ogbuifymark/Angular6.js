const express = require('express');
const bodyParser = require('body-parser');
const bitfinexRoutes = require('./src/app/server-app/routes/bitfinex.routes');
const cors = require('cors');
const http = require('http');
const path = require('path')

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors());
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.use('/bitfinexRoutes', bitfinexRoutes);
// // define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
// });


//deploying app
app.use(express.static(path.join(__dirname + 'dist/bezop-proj')))
app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, 'dist/bezop-proj/index.html'))
})
const port = process.env.PORT || '4000'
app.set('port', port)
// listen for requests
app.listen(4000, () => {
    console.log("Running...");
});
const server = http.createServer(app);






// const express = require('express'),
// path = require('path'),
// bodyParser = require('body-parser'),
// cors = require('cors'),
// mongoose = require('mongoose'),
// config = require('./config/DB');

// mongoose.Promise = global.Promise;
// mongoose.connect(config.DB).then(
//   () => {console.log('Database is connected') },
//   err => { console.log('Can not connect to the database'+ err)}
// );

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// const port = process.env.PORT || 4000;

// const server = app.listen(port, function(){
//  console.log('Listening on port ' + port);
// });
