import { Types } from "mongoose";
import { speciality, userLanguage } from "../enum/user.enum";

export interface IUserFilters{
    count: number,
    sort: 'ASC' | 'DESC',
    speciality: speciality
    sortField: 'raiting' | 'name',
    languages: [userLanguage],
    offerings: [Types.ObjectId],
    search: string,
}