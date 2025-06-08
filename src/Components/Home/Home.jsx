import React from "react";
import { FiSearch, FiStar } from "react-icons/fi";
import FoodData from "../FoodData/FoodData";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 p-6 md:p-12">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto text-center py-12">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight drop-shadow-sm">
                    Order Fresh Food <br />
                    <span className="text-orange-500">In Minutes!</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mt-4 mb-8">
                    Discover local favorites & new tastes near you.
                </p>
              
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
                {[
                    { name: "Pizza", img: "https://imgmediagumlet.lbb.in/media/2023/02/63e39a8dc9ae884e143db091_1675860621236.jpg" },
                    { name: "Burger", img: "https://www.foodandwine.com/thmb/pwFie7NRkq4SXMDJU6QKnUKlaoI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ultimate-Veggie-Burgers-FT-Recipe-0821-5d7532c53a924a7298d2175cf1d4219f.jpg" },
                    { name: "Noodles", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVPvcZIxeA9bZukK18CymY32OqFUTVbkKXgQ&s" },
                    { name: "Ice Cream", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6vnM2cIFeqh6ji6yBGgXKLqcaBeO0KxY1SQ&s" },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="relative group overflow-hidden  rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
                    >
                        <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition"
                        />
                        <div className="absolute inset-0  bg-opacity-30 flex items-end justify-center p-4">
                            <h3 className="text-white font-extrabold  text-2xl  ">{item.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Featured Section */}
            <div className="px-4 md:px-12 py-10 bg-gradient-to-br from-white via-gray-100 to-gray-200 min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Top Rated Foods</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FoodData length={6} ratings={3.5} />
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-16">
                <footer className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <p className="text-center text-gray-600 text-sm">
                        &copy; 2025 Manish Maurya. All rights reserved.
                    </p>
                </footer>
            </div>

        </div>
    );
}

export default Home;
