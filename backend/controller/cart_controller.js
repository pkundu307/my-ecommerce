import Cart  from "../models/cart_entity.js";

export const addToCart = async (req, res) => {
  const { id } = req.user;
  const { product } = req.body; // Assuming product ID is passed in the request body
  
  try {
    // Check if the product is already in the cart for this user
    const existingCartItem = await Cart.findOne({ user: id, product });

    if (existingCartItem) {
      return res.status(400).json({ message: 'Product is already in the cart' });
    }

    // If not in the cart, proceed to add it
    const cart = new Cart({ ...req.body, user: id });
    const doc = await cart.save();
    const result = await doc.populate('product');

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

//fetch the product from the cart by userid
export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const cartItems = await Cart.find({ user: id })
      .populate('product', 'price thumbnail title _id') // Populate only the required fields from product
      .select('quantity product'); // Select quantity and product

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: 'No items found in the cart' });
    }

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};


  // Delete an item from the cart
export const deleteFromCart = async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;

  try {
    const deletedItem = await Cart.findOneAndDelete({ user: id, product: productId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Item removed from cart', deletedItem });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting cart item', error: err.message });
  }
};

// Update the cart item (e.g., quantity)
export const updateCart = async (req, res) => {
  const { id } = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: id, product: productId },
      { $set: { quantity } },
      { new: true }
    ).populate('product');

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Cart item updated', updatedCart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart item', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  const { id } = req.user; 

  try {
    
    const deletedItems = await Cart.deleteMany({ user: id });

    if (deletedItems.deletedCount === 0) {
      return res.status(404).json({ message: 'No cart items found to remove' });
    }

    res.status(200).json({ message: 'All items removed from cart', deletedItems });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
