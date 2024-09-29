import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    // Items array containing productId and quantity for each product in the order
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Payment details
    paymentMethod: { 
      type: String, 
      enum: ['online', 'cash_on_delivery'], 
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
    cancellationReason: { type: String }

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

const Order = mongoose.model('Order', orderSchema);
export default Order;