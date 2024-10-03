import mongoose from 'mongoose';

// Create the Image schema
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Reference the Product schema
    required: true,
  },
}, { timestamps: true });

// Create the Image model
const Image = mongoose.model('Image', imageSchema);

export default Image;
