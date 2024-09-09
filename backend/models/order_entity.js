const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Payment details
    paymentMethod: { 
      type: String, 
      enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'], 
      default: 'pending' 
    },
    
    // Order status
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    },

    // Address selected by the user
    selectedAddress: { type: Schema.Types.Mixed, required: true },

    // Optional: Discount, tax, and shipping
    discount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },

    // Tracking & delivery
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date },
    
  },
  { timestamps: true }
);

// Virtual field for order ID
const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

// Set options for JSON output
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model('Order', orderSchema);
