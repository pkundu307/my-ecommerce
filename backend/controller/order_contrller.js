import Order from "../models/order_entity.js";
// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {id}= req.body;
    const { items, totalAmount, paymentMethod, selectedAddress } = req.body;
    console.log(items, totalAmount, paymentMethod, selectedAddress);
    
    // const order = new Order({
    //   items,
    //   totalAmount,
    //   user,
    //   paymentMethod,
    //   selectedAddress,
    //   discount,
    //   taxAmount,
    //   shippingFee,
    // });

    // const savedOrder = await order.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
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
