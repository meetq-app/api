import mongoose, { Schema } from 'mongoose';
import { appLanguage } from '../enum/app.enum';
import { IOffering } from '../interfaces';

const offeringSchema = new Schema<IOffering>({
  name: {
    [appLanguage.AM]: String,
    [appLanguage.RU]: String,
    [appLanguage.EN]: String,
  },
  description: {
    [appLanguage.AM]: String,
    [appLanguage.RU]: String,
    [appLanguage.EN]: String,
  }
});

const Offering = mongoose.model('Offering', offeringSchema);

export default Offering;
