import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import { Provider } from 'react-redux';
import store from './app/store';
import AdminPanel from './pages/Adminpanel';
import Cart from './components/Cart';
import ProfilePage from './pages/ProfilePage';


function App() {
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
      </Routes>
      <Footer/>
    </Router>
    </Provider>
  );
}

export default App;
