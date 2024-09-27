import Order from "../models/order_entity.js";
import User from "../models/user_entity.js";
import Product from "../models/product/product_entity.js";
import Address from "../models/address_entity.js";

import Razorpay from 'razorpay'
import orderInitiate from "../models/orderInstantiate_entity.js";


const instance = new Razorpay({
  key_id: 'rzp_test_izwrHraJQ0vHKp',
  key_secret: 'Og05QZlM8fwxbNrsiF1kcc6o',
})
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
    totalAmount = totalAmount+shippingFee;

    

    
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
    const { id } = req.user; // Extract the user ID from the authenticated user
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch the user's orders, sorted by creation date (newest first), and populate product details
    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title price thumbnail'); // Populating relevant product fields

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Error fetching orders', error: error.message });
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
// send key 
export const getKey = async (req, res) => {
  return res.status(200).json({ key:"rzp_test_izwrHraJQ0vHKp"})
}

// generate order instance

export const createOnlineOrder = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id, 'id');

    const { items } = req.body;
    let totalAmount = 0;
    let shippingFee = 0;
    
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

    // Add shipping fee if the total amount is less than 500
    if (totalAmount < 500) {
      shippingFee = 40;
    }
    totalAmount = totalAmount + shippingFee;

    console.log('Total Amount:', totalAmount);

    // Creating order with Razorpay or other payment gateway
    const options = {
      amount: Number(totalAmount) * 100, // Razorpay requires amount in paise (for INR)
      currency: "INR",
    };

    const order = await instance.orders.create(options); // Make sure 'instance' is initialized correctly for Razorpay

    console.log('Order created with payment gateway:', order);

    // Save order initiation details in your database
    const orderInst = await orderInitiate.create({
      order_id: order.id,
      userId: id,
      status: "pending", // Status should be a string
    });

    console.log('Order saved in DB:', orderInst);

    // Send response with the order details
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error in creating order:', error);
    return res.status(500).json({ message: 'Error creating order', error });
  }
};
