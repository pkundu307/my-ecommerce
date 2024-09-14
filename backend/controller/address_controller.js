import Address from "../models/address_entity.js";

export const AddAddress = async(req,res)=>{
    const {id} = req.user;
    const {street, city, state, postalCode, country, zip} = req.body;
try{
    
    const user = User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const address = new Address({
        street,
        user_id:id,
        city,
        state,
        postalCode,
        country,
        zip
    });
    const doc = await address.save();
     res.status(201).json(doc);
}catch(err) {
 res.status(500).json({ message: "Error adding address", error: err.message });
}
}