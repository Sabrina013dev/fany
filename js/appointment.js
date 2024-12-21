const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  whatsapp: String,
  date: String,
  time: String,
  services: [String],
});

module.exports = mongoose.model('Appointment', appointmentSchema);
