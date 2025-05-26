const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

const resolvers = {
  Query: {
    doctors: async () => {
      return await Doctor.find();
    },
    patients: async () => {
      return await Patient.find();
    },
    appointments: async () => {
      return await Appointment.find().populate('doctor patient');
    },

    doctorsBySpecialty: async (_, { specialty }) => {
      return await Doctor.find({ specialty });
    },

    patientsByAge: async (_, { minAge, maxAge }) => {
      const filter = {};
      if (minAge !== undefined) filter.age = { ...filter.age, $gte: minAge };
      if (maxAge !== undefined) filter.age = { ...filter.age, $lte: maxAge };
      return await Patient.find(filter);
    },

    appointmentsByDoctor: async (_, { doctorId }) => {
      return await Appointment.find({ doctor: doctorId }).populate('doctor patient');
    },

    appointmentsByPatient: async (_, { patientId }) => {
      return await Appointment.find({ patient: patientId }).populate('doctor patient');
    }
  },

  Mutation: {
    createDoctor: async (_, { name, email, specialty }) => {
      if (!name || !email || !specialty) {
        throw new Error('Missing required field');
      }
      const doctor = new Doctor({ name, email, specialty });
      await doctor.save();
      return doctor;
    },
    updateDoctor: async (_, { id, name, email, specialty }) => {
      const doctor = await Doctor.findById(id);
      if (!doctor) throw new Error('Doctor not found');

      if (name !== undefined) doctor.name = name;
      if (email !== undefined) doctor.email = email;
      if (specialty !== undefined) doctor.specialty = specialty;

      await doctor.save();
      return doctor;
    },
    deleteDoctor: async (_, { id }) => {
      const result = await Doctor.findByIdAndDelete(id);
      return result !== null;
    },

    createPatient: async (_, { name, email, age }) => {
      if (!name || !email || age === undefined) {
        throw new Error('Missing required field');
      }
      const patient = new Patient({ name, email, age });
      await patient.save();
      return patient;
    },
    updatePatient: async (_, { id, name, email, age }) => {
      const patient = await Patient.findById(id);
      if (!patient) throw new Error('Patient not found');

      if (name !== undefined) patient.name = name;
      if (email !== undefined) patient.email = email;
      if (age !== undefined) patient.age = age;

      await patient.save();
      return patient;
    },
    deletePatient: async (_, { id }) => {
      const result = await Patient.findByIdAndDelete(id);
      return result !== null;
    },

    createAppointment: async (_, { date, doctorId, patientId, reason, duration, notes }) => {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) throw new Error('Doctor not found');

      const patient = await Patient.findById(patientId);
      if (!patient) throw new Error('Patient not found');

      if (!date) throw new Error('Date is required');

      const appointment = new Appointment({
        date,
        doctor: doctor._id,
        patient: patient._id,
        reason,
        duration,
        notes
      });

      await appointment.save();
      return appointment.populate('doctor patient');
    },

    updateAppointment: async (_, { id, date, doctorId, patientId, reason, duration, notes }) => {
      const appointment = await Appointment.findById(id);
      if (!appointment) throw new Error('Appointment not found');

      if (date !== undefined) appointment.date = date;

      if (doctorId !== undefined) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) throw new Error('Doctor not found');
        appointment.doctor = doctor._id;
      }

      if (patientId !== undefined) {
        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');
        appointment.patient = patient._id;
      }

      if (reason !== undefined) appointment.reason = reason;
      if (duration !== undefined) appointment.duration = duration;
      if (notes !== undefined) appointment.notes = notes;

      await appointment.save();
      return appointment.populate('doctor patient');
    },

    deleteAppointment: async (_, { id }) => {
      const result = await Appointment.findByIdAndDelete(id);
      return result !== null;
    }
  },

  Person: {
    __resolveType(obj) {
      if (obj.specialty) return 'Doctor';
      if (obj.age !== undefined) return 'Patient';
      return null;
    }
  }
};

module.exports = resolvers;
