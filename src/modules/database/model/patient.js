import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    programIdentifier: {
      type: String,
      required: true,
    },
    dataSource: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    memberId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    telephone: {
      type: String,
    },
    email: {
      type: String,
    },
    consent: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
patientSchema.indexes();

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
