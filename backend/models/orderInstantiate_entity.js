import mongoose from "mongoose";
const OrderInitiateSchema = mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default:"pending",
    enum:["pending", "completed"]
  },
},{ timestamps: true });

const orderInitiate = mongoose.model(
  "orderInitiate",
  OrderInitiateSchema
);

export default orderInitiate;