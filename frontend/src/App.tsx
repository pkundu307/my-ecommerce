// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/general/Navbar';
import Footer from './components/general/Footer';
import routes from './utils/routes';  // Import the routes
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './app/store';
import { useEffect } from 'react';
import { fetchCart, selectCartStatus } from './app/cartSlice';

function App() {
  const dispatch = useDispatch();
  const cartStatus = useSelector(selectCartStatus);
  
  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
