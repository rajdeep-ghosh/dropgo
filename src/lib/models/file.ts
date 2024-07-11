import { Schema, models, model } from 'mongoose';
import type { Document, Model } from 'mongoose';

interface IFile extends Document {
  name: string;
  size: number;
  type: string;
  key: string;
  expires: Date;
  created_at: Date;
}

const fileSchema = new Schema<IFile>({
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

export default (models?.File as Model<IFile>) || model('File', fileSchema);
