const { gql } = require('apollo-server');

const typeDefs = gql`
  enum Specialty {
    CARDIOLOGY
    DERMATOLOGY
    PEDIATRICS
    GENERAL_MEDICINE
  }

  interface Person {
    id: ID!
    name: String!
    email: String!
  }

  type Doctor implements Person {
    id: ID!
    name: String!
    email: String!
    specialty: Specialty!
  }

  type Patient implements Person {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }

  type Appointment {
    id: ID!
    date: String!
    doctor: Doctor!
    patient: Patient!
    duration: Int
    notes: String
    reason: String  
  }

  type Query {
    doctors: [Doctor!]!
    patients: [Patient!]!
    appointments: [Appointment!]!

    doctorsBySpecialty(specialty: Specialty!): [Doctor!]!
    patientsByAge(minAge: Int, maxAge: Int): [Patient!]!
    appointmentsByDoctor(doctorId: ID!): [Appointment!]!
    appointmentsByPatient(patientId: ID!): [Appointment!]!
  }

  type Mutation {
    createDoctor(name: String!, email: String!, specialty: Specialty!): Doctor!
    updateDoctor(id: ID!, name: String, email: String, specialty: Specialty): Doctor
    deleteDoctor(id: ID!): Boolean

    createPatient(name: String!, email: String!, age: Int!): Patient!
    updatePatient(id: ID!, name: String, email: String, age: Int): Patient
    deletePatient(id: ID!): Boolean

    createAppointment(date: String!, doctorId: ID!, patientId: ID!, reason: String, duration: Int, notes: String): Appointment!
    updateAppointment(id: ID!, date: String, doctorId: ID, patientId: ID, reason: String, duration: Int, notes: String): Appointment
    deleteAppointment(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
