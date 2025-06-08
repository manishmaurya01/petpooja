import React, { useEffect, useState } from "react";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { auth, db } from "../../FirebaseConfig"; // make sure you import db here
import { login, logout } from "../../Features/Login/LoginSlice";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Cart from ".././Cart/Cart";
import OrderList from "../OrderList/OrderList";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false); // toggle orders view
  const [currentUser, setCurrentUser] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const dispatch = useDispatch();
  const qnt = useSelector((state) => state.cart.totalQuantity);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCart = () => setShowCart(!showCart);
  const toggleOrders = () => setShowOrders(!showOrders);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        dispatch(
          login({
            user: {
              email: user.email,
              uid: user.uid,
            },
            token: user.accessToken,
          })
        );

        // Setup real-time listener for orders count
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("email", "==", user.email));

        const unsubscribeOrders = onSnapshot(
          q,
          (querySnapshot) => {
            setOrdersCount(querySnapshot.size);
          },
          (error) => {
            console.error("Failed to listen for orders count:", error);
            setOrdersCount(0);
          }
        );

        // Cleanup orders listener when auth changes or component unmounts
        return () => unsubscribeOrders();
      } else {
        setCurrentUser(null);
        setOrdersCount(0);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, [dispatch]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        setCurrentUser(null);
        setOrdersCount(0);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3 md:px-8 w-full z-50">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">FoodieZone</div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <li className="list-none">
              <NavLink
                to="home"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Home
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="menu"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Menu
              </NavLink>
            </li>

            {/* Show Orders Button only if logged in */}
            {currentUser && (
              <button
                onClick={toggleOrders}
                className="relative text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
              >
                Orders
                {ordersCount > 0 && (
                  <span className="absolute -top-2 -right-6 bg-red-500 text-white rounded-full px-2 text-xs font-bold">
                    {ordersCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <li className="list-none">
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="list-none">
                <NavLink
                  to="login"
                  className="text-red-600 hover:text-indigo-600 font-medium"
                >
                  Login
                </NavLink>
              </li>
            )}
            <div
              className="relative flex flex-col items-center cursor-pointer"
              onClick={toggleCart}
            >
              <span className="text-sm text-red-600">{qnt}</span>
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-indigo-600" />
            </div>
          </div>

          {/* Mobile Icon */}
          <div className="md:hidden flex items-center space-x-3">
            <div onClick={toggleCart} className="relative cursor-pointer">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                {qnt}
              </span>
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-indigo-600" />
            </div>
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FiX className="text-2xl text-gray-800" />
              ) : (
                <FiMenu className="text-2xl text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3">
            <li className="list-none">
              <NavLink
                to="home"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Home
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="menu"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Menu
              </NavLink>
            </li>
            {currentUser ? (
              <>
                <li className="list-none">
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
                <li className="list-none">
                  <button
                    onClick={toggleOrders}
                    className="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
                  >
                    Orders{" "}
                    {ordersCount > 0 && (
                      <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs font-bold">
                        {ordersCount}
                      </span>
                    )}
                  </button>
                </li>
              </>
            ) : (
              <li className="list-none">
                <NavLink
                  to="login"
                  className="text-red-600 hover:text-indigo-600 font-medium"
                >
                  Login
                </NavLink>
              </li>
            )}
          </div>
        )}
      </nav>

      {/* Cart Popup Drawer */}
      {showCart && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-gray-600 hover:text-red-500 cursor-pointer"
            >
              <FiX size={24} />
            </button>
          </div>
          <Cart />
        </div>
      )}

      {/* Orders Popup */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Orders ({ordersCount})</h3>
              <button
                className="text-red-600 font-bold cursor-pointer"
                onClick={() => setShowOrders(false)}
              >
                Close
              </button>
            </div>
            <OrderList />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
