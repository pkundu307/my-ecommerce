import { useState } from "react";
import axios from "axios";
import profile from "../images/profile.jpg";
import cart from "../images/cart.jpg";
import adminDashboard from "../images/admindashboard.jpg";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import searchIcon from "../images/search.png";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../app/userSlice";
import { RootState } from "../app/types";
interface GoogleOAuthResponse {
  credential: string;
  clientId: string;
}

function Navbar() {
  const data: number = useSelector(
    (state: RootState) => state.cart.items.length
  );
  console.log("data--->", data);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true); // New state for toggling between login and sign-up
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openLoginPopup = () => {
    setLoginPopupOpen(true);
    setDropdownOpen(false); // Optionally close the dropdown
  };
  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const closeLoginPopup = () => {
    setLoginPopupOpen(false);
  };
  const dispatch = useDispatch();

  const handleGoogleLoginSuccess = async (
    credentialResponse: GoogleOAuthResponse
  ) => {
    const { credential, clientId } = credentialResponse;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/google-auth",
        {
          credential,
          client_id: clientId,
        }
      );

      // Extract the user and token from the response
      const { user, token } = response.data;
      console.log(user);

      // Store user information and JWT token separately
      localStorage.setItem("user", JSON.stringify(user)); // Store the user object (including picture) as a string
      localStorage.setItem("token", token); // Store the JWT token

      // Dispatch the user data to Redux store
      dispatch(setUser(user));
      setLoginPopupOpen(false)
      console.log("Login Success:", response.data);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const localStorageUser = localStorage.getItem("user");
  const userFromLocalStorage = localStorageUser
    ? JSON.parse(localStorageUser)
    : null;

  const user =
    useSelector((state: RootState) => state.user.user) || userFromLocalStorage;
  console.log(user, "<----");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(clearUser());
    setLoginPopupOpen(false)
    setDropdownOpen(false)
  };

  const handleGoogleLoginFailure = (error: Error) => {
    console.error("Login Failed:", error);
  };

  return (
    <>
      <GoogleOAuthProvider clientId="939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com">
        {/* <div className="max-w-screen-lg container mx-auto flex items-center justify-between bg-slate-400 p-5"> */}
        <nav
  className="w-full container mx-auto flex items-center justify-between bg-slate-300 p-5"
  style={{ zIndex: 1, position: 'sticky', top: 0 }}
>

          <div className="container mx-auto flex justify-between items-center">
            {/* Left Section: Logo and Search Bar */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="text-black font-bold text-xl ml-3">
                <Link to={"/"}>Lootlo</Link>
              </div>

              {/* Search Bar */}
              <div className="flex items-center bg-gray-200 rounded-md hidden md:flex">
                <input
                  type="text"
                  placeholder="🔍 Search"
                  className="rounded-md px-2 py-1 bg-gray-200 focus:outline-none w-64"
                />
                {/* Search Icon */}
                <button className="bg-cyan-600 border-b-gray-800 rounded-md p-2">
                  <img
                    src={searchIcon}
                    alt="Search"
                    className="rounded-full h-8 w-8"
                  />
                </button>
              </div>
            </div>

            {/* Right Section: Profile, Cart Icons, and Hamburger Menu */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu */}
              <div className="md:hidden">
                <button onClick={toggleMenu}>
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Large Screen Icons */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? <p>Welcome, {user.name}</p> : <p>Please log in</p>}
                <Link to="/adminpanel">
                  <img
                    src={adminDashboard}
                    alt="admin"
                    className="rounded-full h-10 w-13"
                  />
                </Link>
                {/* Profile Icon */}
                <div className="relative">
                  <div
                    className="text-white flex items-center cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {user ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <img
                        src={profile}
                        alt="Profile"
                        className="rounded-full h-8 w-8"
                      />
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-20">
                      {user ? null : (
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={openLoginPopup}
                        >
                          Login
                        </a>
                      )}
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Settings
                      </a>
                      {user == null ? null : (
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={handleLogout}
                        >
                          Logout
                        </a>
                        )}
                
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <div className="relative text-white">
                  <Link to="/cart">
                    <img
                      src={cart}
                      alt="Cart"
                      className="rounded-full h-8 w-8"
                    />
                  </Link>
                  {data > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {data}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-slate-300 p-5 shadow-lg">
              <div className="flex items-center justify-between space-x-4">
                {/* Search Bar in Mobile */}
                <div className="flex items-center bg-gray-200 rounded-md flex-grow">
                  <input
                    type="text"
                    placeholder="🔍 Search"
                    className="rounded-md px-2 py-1 bg-gray-200 focus:outline-none w-full"
                  />
                  <button className="bg-cyan-600 border-b-gray-800 rounded-md p-2">
                    <img
                      src={searchIcon}
                      alt="Search"
                      className="rounded-full h-8 w-8"
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4 mt-5">
                {/* Admin Panel Icon */}
                <div className="text-white flex items-center cursor-pointer">
                  <Link to="/adminpanel">
                    <img
                      src={adminDashboard}
                      alt="admin"
                      className="rounded-full h-10 w-13"
                    />
                  </Link>
                </div>

                {/* Profile Icon */}
                <div className="relative text-white flex items-center cursor-pointer">
                  <div onClick={toggleDropdown}>
                    {user ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <img
                        src={profile}
                        alt="Profile"
                        className="rounded-full h-8 w-8"
                      />
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                      {user ? null : (
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={openLoginPopup}
                        >
                          Login
                        </a>
                      )}
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Settings
                      </a>

                      {user == null ? null : (
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={handleLogout}
                        >
                          Logout
                        </a>
                        
                      )}
                      <a
                      href="#"
                      onClick={()=>setDropdownOpen(false)}>
                        <center>❌</center>
                      </a>
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <div className="relative text-white">
                  <Link to="/cart">
                    <img
                      src={cart}
                      alt="Cart"
                      className="rounded-full h-8 w-8"
                    />
                  </Link>
                  {data > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {data}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Popup */}
          {loginPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4">
                  {isLoginView ? "Login" : "Sign Up"}
                </h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border rounded-md py-2 px-3"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-600">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full border rounded-md py-2 px-3"
                    />
                  </div>

                  {/* Confirm Password field for Sign-Up */}
                  {!isLoginView && (
                    <div className="mb-4">
                      <label
                        htmlFor="confirm-password"
                        className="block text-gray-600"
                      >
                        Confirm Password:
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full border rounded-md py-2 px-3"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    {isLoginView ? "Login" : "Sign Up"}
                  </button>
                  <button
                    type="button"
                    className="text-gray-600 ml-4"
                    onClick={closeLoginPopup}
                  >
                    Cancel
                  </button>
                </form>
                <div className="mt-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                  />
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={toggleView}
                  >
                    {isLoginView
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Login"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </GoogleOAuthProvider>
    </>
  );
}

export default Navbar;
