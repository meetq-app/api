import { Types } from 'mongoose';
import { appLanguage } from '../enum/app.enum';

export interface IOffering{
  _id: Types.ObjectId;
  name: {
    [appLanguage.AM]: string,
    [appLanguage.RU]: string,
    [appLanguage.EN]: string,
  }
  description: {
    [appLanguage.AM]: string,
    [appLanguage.RU]: string,
    [appLanguage.EN]: string,
  }
}