const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Ensure the coupon code is always uppercase
      trim: true,
    },
    active: {
      type: Boolean,
      default: true, // Whether the coupon is active
    },
    valueByPercentage: {
      type: Number,
      default: null, // Discount value in percentage, e.g., 10 for 10%
    },
    valueByAmount: {
      type: Number,
      default: null, // Discount value in fixed amount, e.g., 20 for $20
    },
    expiresAt: {
      type: Date,
      required: true, // Expiration date of the coupon
    },
  },
  { timestamps: true }
);

// Virtual field for coupon ID
couponSchema.virtual('id').get(function () {
  return this._id;
});

// Customize the JSON output (e.g., removing _id)
couponSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
