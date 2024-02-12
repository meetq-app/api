import { Types } from "mongoose";

export interface ICountry {
  _id: Types.ObjectId;
  name: string;
  countryCode: string;
}
