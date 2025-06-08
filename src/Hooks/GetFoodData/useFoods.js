import { useEffect, useState } from "react";
import { db } from "../.././FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setFoodData } from "../../Features/FoodData/FoodDataSlice";
const useFoods = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "foods"));
        const foodArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (foodArray) {
          dispatch(setFoodData(foodArray)); // Dispatching the food data to the Redux store
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return null;
};

export default useFoods;
