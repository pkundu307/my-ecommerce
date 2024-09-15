import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItemFromCart, selectCartItems, selectCartStatus } from "../app/cartSlice";
import { updateCart } from "../app/cartSlice"; // Assuming this is exported from your slice
import axios from "axios";
import { Link } from "react-router-dom";

const CartComponent = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  console.log(cartItems);

  const cartStatus = useSelector(selectCartStatus);

  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);

  const handleDeleteProduct = async (productId: string, cartId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(removeItemFromCart(cartId));
      console.log("Product deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleQuantityChange = (productId: string, cartId: string, currentQuantity: number, type: 'increment' | 'decrement') => {
    console.log(productId,cartId,currentQuantity);
    
    const newQuantity = type === 'increment' ? currentQuantity + 1 : currentQuantity - 1;

    // Ensure quantity does not go below 1
    if (newQuantity < 1) return;

    dispatch(updateCart({ productId, quantity: newQuantity }));
  };

  return (
    <div className="font-sans max-w-6xl max-md:max-w-xl mx-auto p-4" style={{ zIndex: -1 }}>
      <h1 className="text-2xl font-extrabold text-gray-800">My Cart</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]" key={item.id}>
              <div className="flex gap-4">
                <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                  <img
                    src={item.product.thumbnail || ""}
                    className="w-full h-full object-contain rounded-lg"
                    alt="Product Thumbnail"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">{item.product.title}</h3>
                    <p className="text-sm font-semibold text-gray-500 mt-2 flex items-center gap-2">
                      Color: <span className="inline-block w-5 h-5 rounded-md bg-[#ac7f48]"></span>
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center w-5 h-5 bg-gray-400 outline-none rounded-full"
                      onClick={() => handleQuantityChange(item.product.id, item.id, item.quantity, 'decrement')}
                    >
                      <span style={{ color: 'white' }}>-</span>
                    </button>
                    <span className="font-bold text-sm leading-[18px]">{item.quantity}</span>
                    <button
                      type="button"
                      className="flex items-center justify-center w-5 h-5 bg-gray-400 outline-none rounded-full"
                      onClick={() => handleQuantityChange(item.product.id, item.id, item.quantity, 'increment')}
                    >
                      <span style={{ color: 'white' }}>+</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex flex-col">
                <div className="flex items-start gap-4 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 cursor-pointer fill-gray-400 inline-block" viewBox="0 0 64 64">
                    <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" />
                  </svg>
                  <button onClick={() => handleDeleteProduct(item.product.id, item.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 cursor-pointer fill-gray-400 inline-block" viewBox="0 0 24 24">
                      <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                      <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-base font-bold text-gray-800 mt-auto">₹{item.product.price}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Total and Checkout */}
        <div className="p-4 bg-white rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)] space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
          <div className="flex justify-between text-gray-600">
            <span>Total:</span>
            <span className="font-bold">₹{cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)}</span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => console.log("Proceed to Checkout")}
          >
          <Link to='/order'> Proceed to Checkout</Link> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
