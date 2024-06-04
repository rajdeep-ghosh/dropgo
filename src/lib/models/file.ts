import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
);

export default mongoose.model('File', fileSchema);
