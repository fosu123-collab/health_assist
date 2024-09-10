// routes/index.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Display home page
router.get('/', (req, res) => {
  res.render('index');
});

// Add a new patient
router.post('/add-patient', patientController.addPatient);

// Send reminders and form
router.post('/send-reminders', patientController.sendReminders);

module.exports = router;
