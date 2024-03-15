import { InvalidCreedentialsdError } from '../errors';
import Coupon from '../models/coupon.model';
import transactionService from './transaction.service';

class CouponService {
  async applyCoupon(code: String, patient: any): Promise<string> {
    const coupon = await Coupon.findOne({ code, applyed_by: null });
    if (!coupon) {
       throw new InvalidCreedentialsdError('Invalid coupon number');
    }

    await transactionService.couponTransaction(patient, coupon);
    return(coupon.ammount.toString());
  }
}

export default new CouponService()
