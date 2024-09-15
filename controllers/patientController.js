require('dotenv').config();
const Patient = require('../models/patient');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Add a new patient
exports.addPatient = async (req, res) => {
  const { name, phone, email, prescribedMedicine, dosage, frequency, duration } = req.body;

  // Sanitize phone number and ensure it's in E.164 format
  let formattedPhone = phone.trim(); // Trim any extra spaces
  
  // For Ghana numbers (adjust for your region)
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '+233' + formattedPhone.slice(1);
  }
  
  // Validate if the number starts with a '+'
  if (!formattedPhone.startsWith('+')) {
    return res.status(400).send('Invalid phone number format.');
  }

  const startDate = new Date();
  const patient = new Patient({
    name, 
    phone: formattedPhone, 
    email, 
    prescribedMedicine, 
    dosage, 
    frequency, 
    duration, 
    startDate, 
    lastNotification: null
  });

  await patient.save();
  res.redirect('/');
};


// Send medication reminders
exports.sendReminders = async () => {
  const patients = await Patient.find();

  patients.forEach(async patient => {
    try {
      const formattedPhoneNumber = patient.phone; // Use dynamic phone number from DB
      // Send reminder via SMS every minute
      const message = await twilio.messages.create({
        body: 'Remember to take your medication as prescribed. Adherence is very important. Fill out the form: http://example.com/form',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhoneNumber,
      });

      // Log success message
      console.log(`Reminder sent to ${formattedPhoneNumber}, SID: ${message.sid}`);
      
      // Update the last notification time
      patient.lastNotification = new Date();
      await patient.save();
    } catch (error) {
      console.error(`Failed to send reminder to ${patient.phone}:`, error);
    }
  });
};

