require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const { eq } = require('./utils/getPage.js');
const { formatPhone } = require('./utils/phoneNumberHelper.js');

const app = express();

// mongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//opening of sessions 
app.use(
    session({
        secret: "my_secret_key",
        saveUninitialized: false,
        resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
//for the browser not to save caches for user persistence purposes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });

// view engine setup
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main', // main layout
  helpers: { eq, formatPhone},
  layoutsDir: path.join(__dirname, 'views', 'layouts'), // Directory where layout files are stored
  partialsDir: path.join(__dirname, 'views', 'partials') // Directory for reusable template 
}));app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// route declaration
const loginRoute = require('./routes/r_login');
const searchBarRoute = require('./routes/r_searchBar');
const eventListRoute = require('./routes/r_event_list.js');
const notificationRoute = require('./routes/r_notifications.js');
const eventDetailsRoute = require('./routes/r_event_details.js');
const teamRoute = require('./routes/r_team');
const eventCreateRoute = require('./routes/r_event_create.js');
const delete_cancelEvent = require('./routes/r_delete_cancelEvent.js');
const eventAttendanceRoute = require('./routes/r_event_attendance.js');
const pastEventsRoute = require('./routes/r_past_events.js');

// routes
app.use('/', loginRoute); 
app.use('/', searchBarRoute);
app.use('/', eventListRoute);
app.use('/', notificationRoute);
app.use('/', eventDetailsRoute);
app.use('/', teamRoute);
app.use('/create', eventCreateRoute);
app.use('/', loginRoute); 
app.use('/', searchBarRoute);
app.use('/', delete_cancelEvent);
app.use('/', eventAttendanceRoute);
app.use('/', pastEventsRoute);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});