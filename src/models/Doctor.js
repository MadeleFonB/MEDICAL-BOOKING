const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, enum: ['CARDIOLOGY', 'DERMATOLOGY', 'PEDIATRICS', 'GENERAL_MEDICINE'], required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);
