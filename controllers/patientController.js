require('dotenv').config();
// controllers/patientController.js
const Patient = require('../models/patient');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const nodemailer = require('nodemailer');

// Add a new patient
exports.addPatient = async (req, res) => {
  const { name, phone, email, prescribedMedicine, dosage, frequency, duration } = req.body;
  const startDate = new Date();
  const patient = new Patient({ name, phone, email, prescribedMedicine, dosage, frequency, duration, startDate });
  await patient.save();
  res.redirect('/');
};

// Send medication reminders
exports.sendReminders = async () => {
  const patients = await Patient.find();
  
  patients.forEach(patient => {
    const currentTime = new Date();
    const hoursElapsed = (currentTime - patient.lastNotification) / 36e5; // ms to hours
    
    if (hoursElapsed >= patient.frequency) {
      // Send reminder via SMS
      twilio.messages.create({
        body: 'Remember to take your medication as prescribed. Adherence is very important. Fill out the form: http://example.com/form',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: patient.phone,
      });

      // Update last notification time
      patient.lastNotification = currentTime;
      patient.save();
    }
  });
};

// Process form submission (e.g., to track symptoms)
exports.processForm = async (req, res) => {
  // Logic to update patient info with symptom data
};
