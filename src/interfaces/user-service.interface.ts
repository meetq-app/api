import { Document, ObjectId, Types } from "mongoose";
import { userRole } from "../enum/user.enum";

export interface IUserService {
    findUserById(id: Types.ObjectId): Promise<Document>
    findUserByEmail(email: string): Promise<Document>
    createUser(email: string): Promise<Document>
    updateAvatar(id: Types.ObjectId, base64String: string): Promise<string>
    generateVerificationCode(email: string): Promise<number>
    checkVerifivationCode(email: string, code: string): Promise<boolean>
    generateJWT(email: string, id: string, role: userRole): string
}