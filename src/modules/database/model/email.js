import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    scheduleDate: {
      type: Date,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
emailSchema.indexes();

const Email = mongoose.model('Email', emailSchema);
export default Email;
