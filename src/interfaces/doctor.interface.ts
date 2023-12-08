import { activeStatus, speciality, userCountry } from '../enum/user.enum';
import { IOffering } from './offering.interface';
import { ISchedule } from './schedule.interface';
import { IUser } from './user.interface';

export interface IDoctor extends IUser {
    activeStatus: activeStatus,
    speciality: speciality, 
    info?: string,
    certificates?: Array<string>
    offerings?: [
        {
            offer: IOffering,
            price: number
        }
    ],
    schedule?: ISchedule
}