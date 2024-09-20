import axios from 'axios';

const PaymentComponent = () => {


  const handlePayment = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXN0cmlidXRvcklkIjoiNjZlMjk5MTc5MzJjNjJjNTc3NzNhZDRjIiwiaWF0IjoxNzI2ODI1MTEyLCJleHAiOjE3MjY4Mjg3MTJ9.TV4Zl--8nxbyBN4ZresSFB__MBZiRDbVcgkolG5rpAA'; // Replace with your actual bearer token
    
    try {
      // First API call to get the key
      const { data: { key } } = await axios.get("https://zauvijek-book-backend.vercel.app/distributor/getKey");
      console.log("Key retrieved:", key);
      // Second API call to checkout
 // Replace with your actual package_id
 const response = await axios.post(
    "https://zauvijek-book-backend.vercel.app/distributor/payment",
    { package_id: "66ec18e672e5bb7a287a0cea" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log('Checkout Response:', response);
 
  console.log('Order:', response.data.data.id);
  
  
      const options ={
        key,
        amount:response.data.data.amount,
        currency:"INR",
        name:"Sinmplyjs",
        description:"Razorpay tutorial",
        image:"https://avatars.githubusercontent.com/u/96648429?s=96&v=4",
        order_id:response.data.data.id,
        callback_url:"https://zauvijek-book-backend.vercel.app/distributor/paymentverification",
        prefill:{
          name:"Sagar gupta",
          email:"anandguptasir@gmail.com",
          contact:"1234567890"
        },
        notes:{
          "address":"razorapy official"
        },
        theme:{
          "color":"#3399cc"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error('Error during payment handling:', error);
    }
  };
  

  return (
    <div>
      <h2>Payment</h2>
      
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentComponent;
