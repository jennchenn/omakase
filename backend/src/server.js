const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const cors = require('cors');

const health = require('./routes/health/health.routes');
const user = require('./routes/user/user.routes');
const calendar = require('./routes/calendar/calendar.routes');
const group = require('./routes/group/group.routes');

const authentication = require('./middleware/authentication');

const app = express();

// Connect to the database
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to MongoDB: ${err}`);
  process.exit();
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database!');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.get('/health', health.health);
// app.post('/image', [authentication, upload.array('images')], image.upload);
// app.get('/image', authentication, image.searchByName);
// app.get('/image/user', authentication, image.retrieveAllByUser);
app.post('/user/register', user.register);
app.post('/user/login', user.login);
app.get('/calendar/events', authentication, calendar.listEvents);
app.get('/calendar/list', authentication, calendar.getCalendars);
app.post('/calendar/meeting', authentication, calendar.setNextMeeting);
app.post('/calendar/groupMeeting', authentication, calendar.setNextMeetingGroup);
// app.get('/calendar/list', authentication, calendar.getCalendars);
app.get('/user/groups', authentication, group.getUserGroups);
app.get('/group/:id', authentication, group.findGroup);
app.post('/group', authentication, group.createGroup);
app.post('/group/newMember', authentication, group.addMember);
module.exports = app;
