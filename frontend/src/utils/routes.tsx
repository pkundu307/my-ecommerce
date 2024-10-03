// src/utils/routes.ts
import Home from "../pages/Home";
import Cart from "../components/Cart";
import ProductDetail from "../components/ProductDetail";
import AdminPanel from "../pages/Adminpanel";
import ProfilePage from "../pages/ProfilePage";
import OrderPage from "../pages/OrderPage";
import OrderSuccess from "../components/OrderSuccess";
import MyOrder from "../components/MyOrder";
import ProductForm from "../components/ProductForm";

interface Route {
  path: string;
  element: JSX.Element;  // This expects an actual JSX element.
}

const routes: Route[] = [
  { path: "/", element: <Home /> },            
  { path: "/cart", element: <Cart /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/adminpanel", element: <AdminPanel /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/order-success", element: <OrderSuccess /> },
  { path: "/orders", element: <MyOrder /> },
  { path: "/addproduct", element: <ProductForm /> },
  { path: "/carouselset", element: <ProductForm /> },
];

export default routes;
