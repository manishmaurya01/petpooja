import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';


const Layout = () => (
    <>
        <Navbar />
        <Outlet />

    </>
);

export default Layout;