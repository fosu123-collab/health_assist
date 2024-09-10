// models/patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  prescribedMedicine: String,
  dosage: String,  // e.g., '500mg'
  frequency: Number, // in hours (e.g., every 8 hours)
  duration: Number, // in days (e.g., 3 days)
  lastNotification: Date,
  startDate: Date, // date of prescription
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
