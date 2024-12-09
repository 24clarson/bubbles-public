// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const http = require('http');
const port = process.env.PORT || 3000
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

app.use(express.static( path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('*', (req, res) => {
  res.render('index')
})

app.listen(port,() => {
  console.log(`Server running at port `+port);
});


console.log("Hello World")
app.post("/fetchAccessToken", async (req, res) => {
  console.log("Received access token request");
  result = await fetchAccessToken(req.body);
  res.json(result);
});

async function fetchAccessToken(info) {
  const clientSecret = '044f7e30b9b1e6c04ed1a4af70f4cc118946d52f';

  try {
      const response = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              client_id: info.client_id,
              client_secret: clientSecret,
              code: info.code,
              grant_type: info.grant_type,
              redirect_uri: info.redirect_uri,
          }),
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch access token: ${response.status}`);
      }

      const data = await response.json();
      console.log('Access Token:', data.access_token);

      return data;
  } catch (error) {
      console.error('Error fetching access token:', error);
  }
}

module.exports = app;
