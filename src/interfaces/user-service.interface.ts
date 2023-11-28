import { ObjectId } from "mongoose";
import { IUser } from "./user.interface";

export interface IUserService {
    findUserById(id: ObjectId): Promise<IUser>
    findUserByEmail(email: string): Promise<IUser>
    createUser(email: string): Promise<IUser>
    generateVerificationCode(email: string): Promise<number>
    checkVerifivationCode(email: string, code: string): Promise<boolean>
    generateJWT(email: string, id: string): string
}