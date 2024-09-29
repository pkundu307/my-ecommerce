import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the product schema
const productSchema = new Schema(
  {
    title: { type: String, required: false, unique: true },
    description: { type: String, required: false },
    price: {
      type: Number,
      min: [1, "wrong min price"],
      max: [1000000, "wrong max price"],
    },
    purchasePrice: {
      type: Number, 
      min: [1, "wrong min purchase price"], 
      required: false,
    },
    mrp: {
      type: Number, 
      min: [1, "wrong min MRP"], 
      required: false,
    },
    sellingPrice: {
      type: Number, 
      min: [1, "wrong min selling price"], 
      required: false,
    },
    gstTax: {
      type: Number,
      min: [0, "wrong min GST"],
      max: [100, "wrong max GST"],
      required: false,
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max rating"],
      default: 0,
    },
    seller_id: { type: String, required: false },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    brand: { type: String, required: false },
    category: { type: String, required: false },
    thumbnail: { type: String, required: false },
    images: { type: [String], required: false },
    userIdsFN: [{ type: Schema.Types.ObjectId, ref: "User" }],
    userIdsFA: [{ type: Schema.Types.ObjectId, ref: "User" }],
    colors: { type: [Schema.Types.Mixed], default: [] },
    sizes: { type: [Schema.Types.Mixed], default: [] },
    highlights: { type: [String] },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    coupon: { type: String, default: null },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    manufacturer: { type: String },
    supplier: { type: String },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
  },
  { timestamps: true }
);

// Add a virtual ID field
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// Index fields for better query performance
productSchema.index({ title: 1, brand: 1, category: 1 });

// Export the Product model
const Product = mongoose.model("Product", productSchema);
export default Product;
