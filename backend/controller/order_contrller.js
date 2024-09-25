import Order from "../models/order_entity.js";
import User from "../models/user_entity.js";
import Product from "../models/product/product_entity.js";
import Address from "../models/address_entity.js";
// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {id}= req.user;
    const { items, paymentMethod, selectedAddress } = req.body;
    const user = await User.findById(id);
    const address = await Address.findById(selectedAddress)
    const finalAddress = address.street+","+address.city+','+address.state+","+address.postalCode+","+address.country;
    // console.log(items, totalAmount, paymentMethod, selectedAddress, id);
    let totalAmount = 0;
    let shippingFee=0;

    for (let item of items) {
      const productId = item.productId;
      const quantity = item.quantity;

      // Find the product by its ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found.` });
      }

      // Multiply the price of the product by its quantity and add to totalAmount
      totalAmount += product.price * quantity;
    }


    if(totalAmount<500){
      shippingFee=40
    }
    
    const order = new Order({
      items,
      totalAmount,
      user,
      paymentMethod,
      selectedAddress:finalAddress,
      shippingFee,
    });

    const savedOrder = await order.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const {id} = req.user;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Update order status (e.g., from pending to shipped)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, paymentStatus, trackingNumber, estimatedDeliveryDate } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, paymentStatus, trackingNumber, estimatedDeliveryDate },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating order', error });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting order', error });
  }
};
