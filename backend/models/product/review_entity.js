import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Review schema
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to the Product model
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be greater than 5'],
    required: true,
  },
  comment: { type: String, required: false },
  date: { type: Date, default: Date.now }
});

// Export the Review model
const Review = mongoose.model('Review', reviewSchema);
export default Review;
