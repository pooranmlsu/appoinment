const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, 
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
