import { Types } from "mongoose";

export interface Ilanguage {
  _id: Types.ObjectId;
  id: string;
  title: string;
  nativeTitle: string;
  flagUrl: string
}
