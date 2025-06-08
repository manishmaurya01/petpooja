import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Features/CartSlice/CartSlice';

function FoodData({ length, ratings }) {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const mydata = useSelector((state) => state.foodData.data);
  const dispatch = useDispatch();
  useEffect(() => {
    if (mydata && mydata.length > 0) {
      const filtered = mydata
        .filter(item => item.food_ratings >= ratings)
        .slice(0, length ? length : mydata.length);
      setFilteredData(filtered);
      console.log(filtered);
      setLoading(false);
    }
  }, [mydata, ratings, length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {filteredData.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col justify-between"
        >
          <img
            src={item.food_img}
            alt={item.food_name}
            className="h-48 w-full object-cover"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {item.food_name}
              </h3>
              <p className="text-sm text-gray-600">{item.food_desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-yellow-500 font-semibold">
                ⭐ {item.food_ratings}
              </span>
              <button className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-300 shadow-md"
              id={item.id}
              onClick={(e)=>{
                filteredData.map((i) => {
                    if (i.id === e.target.id) {
                        console.log("Item added to cart:", i);
                        dispatch(addToCart(i));
                    }
                })
              }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default FoodData;
