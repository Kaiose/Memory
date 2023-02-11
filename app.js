
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
const salt = require('./utils/auth');
const fs = require('fs');

const https = require('https');
const { WebSocketServer } = require('ws');

// custom module
var ConfigLocal = require('./utils/config_local');
var indexRouter = require('./4.routes/index');
var usersRouter = require('./4.routes/users');
var recordRouter = require('./4.routes/record');
var recordTableRouter = require('./4.routes/record_table');

var userModel = require('./1.models/user');
const ClientMgr = require('./2.client/client_mgr');



var url = process.env.MONGOURL;
mongoose.connect(url, (err)=>{
  if(err){throw err}
  var status = mongoose.connection;
  status.on('error', console.error.bind(console, 'Mongoose connection error'));
});


passport.use(new Strategy((username, password, done) => {
    userModel.findOne({ email: username }, (err, user) => {
      if (err) { return done(err); };
      if (!user) { return done(null, false, {message: 'Invalid credentials provided'}); };
      if (user.password !== salt.hashPassword(password)) { return done(null, false); }

      return done(null, user);
    });
  }));

passport.serializeUser((user, done)=>{
  done(null, user._id);
});

passport.deserializeUser((id, done)=>{
    userModel.findById(id, function(err, user){
      done(err, user);
    })
});

var app = express();

app.use(compression());


// csp(Content-Security-Policy)
const cspOptions = {
  directives: {
    // 기본 옵션을 가져옵니다.
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    
    // 구글 API 도메인과 인라인된 스크립트를 허용합니다.
    "script-src": ["'self'", "*.googleapis.com", "'unsafe-inline'"],

    "connect-src" : ["'self'", "ws://127.0.0.1:5000", "http://127.0.0.1:4000"]
  }
}

app.use(helmet({
  contentSecurityPolicy: cspOptions
}));

// view engine setup
app.set('views', path.join(__dirname, '6.views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '5.public')));

app.use(session({
  secret: 'secr3t',
  resave: false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next)=>{
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/record', recordRouter);
app.use('/record_table', recordTableRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/// prepare manager
var client_mgr = new ClientMgr();

function StartServer()
{
    const config_local_path = "config_local.json";
    const config_local = new ConfigLocal();
    let result = config_local.load(config_local_path);
    if (!result)
    {
      console.log(`[config_local] load fail`);
      return;
    }

    client_mgr.init(config_local);

    if (config_local.get('use_ws'))
      OpenWSS(config_local.get('ws_port'));

    if (config_local.get('use_https'))
      OpenHttp(config_local.get('https_port'));

}

function OpenWSS(port)
{
  const websocket = new WebSocketServer({port: port});

  websocket.on('connection', (client_socket) => {
    console.log('Connected New Client');
    client_mgr.createUser(client_socket);
  });

  console.log(`Start With WebSocket, can connect (127.0.0.1:${port}) `);
}

function OpenHttp(port)
{
  const ssl_key_path  = __dirname + '/ssl/server.key';
  const ssl_cert_path = __dirname + '/ssl/server.crt';
  const ssl_ca_path   = __dirname + '/ssl/server.csr';

  console.log(ssl_key_path);

  let can_use_ssl = true;
      can_use_ssl &= fs.existsSync(ssl_key_path);
      can_use_ssl &= fs.existsSync(ssl_cert_path);
      can_use_ssl &= fs.existsSync(ssl_ca_path);

  if (can_use_ssl)
  {
      const options = {
          key: fs.readFileSync(ssl_key_path),
          cert: fs.readFileSync(ssl_cert_path),
          ca: fs.readFileSync(ssl_ca_path),
      }

      https.createServer(options, app).listen(port, () => {
        console.log("Start With Https, can connect (private ip or share hub ip) ")
        console.log(`Listening on port ${port}`);
      });
  }
  else
  {
      app.listen(port, (err)=>{
        if(err) throw err;
        console.log(`Start With Http, can connect (127.0.0.1:${port})`);
      })
  } 
}

StartServer();

module.exports = app;
