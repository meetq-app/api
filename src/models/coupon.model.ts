import mongoose, { Schema } from 'mongoose';
import { ICoupon } from '../interfaces/coupon.interface';

const couponSchema = new Schema<ICoupon>({
  code: String,
  ammount: Number,
  applyed_by: {
    type: Schema.Types.ObjectId,
    nullable: true
  },
  applyed_date: {
    type: Date,
    nullable: true
  }
}, {
  timestamps: true 
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
