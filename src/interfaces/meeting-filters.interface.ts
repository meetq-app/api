import { Types } from "mongoose";
import { speciality, userLanguage } from "../enum/user.enum";

export interface IMeetingFilters{
    limit: number,
    sort: 'ASC' | 'DESC',
}