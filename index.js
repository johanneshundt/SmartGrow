require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const mongoStore  = require('connect-mongo');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const router = require('./app/routes')
const tools = require('./app/tools');

//TODO: remove fake data
global.FAKEVALUES = {
	temperature:27,
	humidity:60,
	status: {
		fan:true,
		exhaust:true,
		water:true,
		light:true
	},
	protect:{}
}
global.IO = io;
global.Log = require('./app/tools/logger');
global.VALUES = {
	layoutChanged: true  //TODO: set this in session
};
IO.on('connection', (socket) => {
	VALUES.layoutChanged = true;
});
//View engine
app.set('views', path.join(__dirname, 'app/view'));
app.set('view engine', 'pug');
//Session
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	rolling: true,
	cookie: { maxAge: 7400000 },
	store: mongoStore.create({mongoUrl: process.env.MONGODB_CONN})
}));
//Body parsers
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
//Static dir
app.use(express.static(path.join(__dirname, 'public')));
//Inject render html function and request logger
app.use(function (req, res, next) {
	req.log = {
		renderError:function(message){Log.renderError(message,req)},
		log:function (message){Log.log(message,req)},
		debug:function (message){Log.debug(message,req)},
		info:function (message){Log.info(message,req)},
		warning:function (message){Log.warning(message,req)},
		error:function (message){Log.error(message,req)},
		critical:function (message){Log.critical(message,req)},
	}
	res.renderHtml = async function(path,options) {
		res.render(path, await tools.payload(req, options), (err, html) => {
			if(err){
				console.log(err)
				req.log.renderError(err)
				res.redirect('/error/500')
			}
			else {
				res.send(html)
			}
		})
	}
	next();
})
app.set('trust proxy', true)
//Router
app.use('/',router.frontend);
app.use('/set',router.set);
app.use('/modal',router.modal);
app.use('/error',router.error);
//API router
app.use('/api',router.api); //public api
//Mongoose (MongoDB)
mongoose.connect(process.env.MONGODB_CONN,{
	useUnifiedTopology: false,
	serverSelectionTimeoutMS: 0,
	socketTimeoutMS:0,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//Server Activation
db.once('open', function() {
	server.listen(process.env.PORT, () => {
		console.clear()
		console.info('SmartGrow');
		console.log('Server running on port ' + process.env.PORT);
		Log.info('Server started')
	});
});