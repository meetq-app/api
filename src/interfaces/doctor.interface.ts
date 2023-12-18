import { Types } from 'mongoose';
import { activeStatus, speciality, userCountry, userLanguage } from '../enum/user.enum';
import { IOffering } from './offering.interface';
import { ISchedule } from './schedule.interface';
import { IUser } from './user.interface';

export interface IDoctor extends IUser {
    activeStatus: activeStatus,
    speciality: speciality,
    raiting: number,
    raitedCount: number,
    languages: [userLanguage]; 
    info?: string,
    certificates?: Array<string>
    offerings?: [
        {
            offerId: Types.ObjectId,
            price: number
        }
    ],
    schedule?: ISchedule
}