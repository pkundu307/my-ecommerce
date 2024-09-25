import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './app/store';
import AdminPanel from './pages/Adminpanel';
import Cart from './components/Cart';
import ProfilePage from './pages/ProfilePage';
import { useEffect } from 'react';
import { fetchCart, selectCartStatus } from './app/cartSlice';
import OrderPage from './pages/OrderPage';
import PaymentComponent from './components/Test';
import OrderSuccess from './components/OrderSuccess';


function App() {
  
  const dispatch = useDispatch();
  const cartStatus = useSelector(selectCartStatus);
  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch]);
  return (
    <Provider store={store}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order" element={<OrderPage/>} />
        <Route path="/order-success" element={<OrderSuccess />}  />
      </Routes>
      <Footer/>

    </Router>
    </Provider>
  );
}

export default App;
