import { Types } from "mongoose";

export interface ICurrency {
  _id: Types.ObjectId;
  code: string;
  title: string;
  symbol: string;
  usdCourse: number
}
