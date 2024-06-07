import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() + 1)) // +24 hrs
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

export default mongoose.model('File', fileSchema);
