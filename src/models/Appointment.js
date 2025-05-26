const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  duration: { type: Number },
  notes: { type: String },
  reason: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
