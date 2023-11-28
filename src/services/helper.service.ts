import { respStatus } from "../enum/response.enum";

export class HelperService{
    static generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
      }

      static formatResponse(status: respStatus, body: any) {
        return {
          status,
          body
        }
      }
}