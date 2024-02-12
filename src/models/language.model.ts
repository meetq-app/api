import mongoose, { Schema } from 'mongoose';
import { Ilanguage } from "../interfaces";

const languageSchema = new Schema<Ilanguage>({
  id: {
    type: String,
    required: true, 
    unique: true,   
    trim: true      
  },
  title: {
    type: String,
    required: true
  },
  nativeTitle: {
    type: String,
    required: true
  },
  flagUrl: {
    type: String,
    required: true
  },
});

const Language = mongoose.model('Language', languageSchema);
export default Language