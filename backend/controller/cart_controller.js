import Cart  from "../models/cart_entity.js";

export const addToCart = async (req, res) => {
    const {id} = req.user;
    console.log(id);
    
    const cart = new Cart({...req.body,user:id});
    try {
      const doc = await cart.save();
      const result = await doc.populate('product');
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
  };