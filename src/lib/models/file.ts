import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    filesize: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true
    },
    url: String
  },
  { timestamps: true }
);

export default mongoose.model('File', fileSchema);
