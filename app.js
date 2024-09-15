require('dotenv').config();
// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.use('/', indexRoutes);

/*const cron = require('node-cron');
const patientController = require('./controllers/patientController');

// Schedule cron job to run every hour
cron.schedule('* * * * *', () => {
  patientController.sendReminders();
});*/


// Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
