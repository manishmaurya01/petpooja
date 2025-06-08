import React, { useEffect } from 'react';
import Login from './Components/Login/Login';
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Components/Home/Home';
import Signup from './Components/Signup/Signup';
import useFoods from './Hooks/GetFoodData/useFoods';
import Menu from './Components/Menu/Manu';
function App() {

  useFoods();
  
  const user = useSelector((state) => state.login.user);

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user.email);
    } else {
      console.log("No user is logged in");
    }
  }, [user]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="login/signup" element={<Signup />} />
        <Route path="menu" element={<Menu />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;
