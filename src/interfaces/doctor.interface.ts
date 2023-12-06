import { userCountry } from '../enum/user.enum';
import { IOffering } from './offering.interface';
import { IUser } from './user.interface';

export interface IDoctor extends IUser {
    info?: string,
    certificates?: Array<string>
    offerings?: [
        {
            offer: IOffering,
            price: number
        }
    ]
}