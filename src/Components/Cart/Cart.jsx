import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
} from '../../Features/CartSlice/CartSlice';

import { db } from '../../FirebaseConfig';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const cart = useSelector((state) => state.cart.cart); // array of {id, quantity}
    const dispatch = useDispatch();

    // State to hold full updated food data from Firestore for items in cart
    const [itemsData, setItemsData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const [address, setAddress] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    // Fetch fresh food data from Firestore whenever cart changes
    useEffect(() => {
        if (cart.length === 0) {
            setItemsData([]);
            setTotalPrice(0);
            return;
        }

        const fetchItemsData = async () => {
            try {
                // Assuming your 'foods' collection has documents with food item IDs same as cart ids
                // If your cart ids are not doc ids, you can modify accordingly

                // We can fetch all docs in one go by their ids using Promise.all
                const promises = cart.map(async (cartItem) => {
                    const docRef = doc(db, 'foods', cartItem.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        return {
                            id: cartItem.id,
                            quantity: cartItem.quantity,
                            food_name: data.food_name,
                            food_price: parseFloat(data.food_price), // convert string price to number
                            food_desc: data.food_desc,
                            food_img: data.food_img,
                            food_ratings: data.food_ratings,
                        };
                    } else {
                        // If doc not found, just return item with quantity and no details
                        return { id: cartItem.id, quantity: cartItem.quantity };
                    }
                });

                const results = await Promise.all(promises);

                // Calculate total price based on fetched data
                let total = 0;
                results.forEach((item) => {
                    if (item.food_price) {
                        total += item.food_price * item.quantity;
                    }
                });

                setItemsData(results);
                setTotalPrice(total);
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        };

        fetchItemsData();
    }, [cart]);

    // Place Order handler
    const handlePlaceOrder = async () => {
        if (!user || !user.email) {
            alert('You must be logged in to place an order.');
            return;
        }
        if (!address.trim()) {
            alert('Please enter your delivery address.');
            return;
        }
        if (itemsData.length === 0) {
            alert('Cart is empty or items are not loaded yet.');
            return;
        }

        try {
            const order = {
                email: user.email,
                items: itemsData.map(({ id, food_name, quantity, food_price }) => ({
                    id,
                    food_name,
                    quantity,
                    price: food_price,
                })),
                totalPrice,
                address,
                placedAt: serverTimestamp(),
                status: 'Placed',
            };

            await addDoc(collection(db, 'orders'), order);
            dispatch(clearCart());
            setShowOrderPopup(false);
            setAddress('');
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Try again.');
        }
    };

    return (
        <div className="p-4 relative">
            {itemsData.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
                <>
                    {itemsData.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-2 border-b"
                        >
                            <div className="flex items-center space-x-4">
                                {item.food_img && (
                                    <img
                                        src={item.food_img}
                                        alt={item.food_name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <h3 className="font-medium">{item.food_name}</h3>
                                    <p className="text-sm text-gray-500">{item.food_desc}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <button
                                            onClick={() => dispatch(decreaseQuantity(item.id))}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => dispatch(increaseQuantity(item.id))}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">
                                    ₹{(item.food_price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="text-red-500 text-xs hover:underline cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-lg font-bold mt-4">Total: ₹{totalPrice.toFixed(2)}</div>

                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full cursor-pointer"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={() => {
                                if (!user) {
                                    alert('You must be logged in to place an order.');
                                    return;
                                } else {
                                    setShowOrderPopup(true);
                                }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full cursor-pointer"
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}

            {/* Order Popup */}
            {showOrderPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white w-full h-full p-6 overflow-y-auto max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">Enter Delivery Address</h2>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                            placeholder="Your full delivery address..."
                        ></textarea>

                        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {itemsData.map((item) => (
                                <div key={item.id} className="border-b pb-2 flex justify-between">
                                    <p>
                                        {item.food_name} x {item.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        ₹{(item.food_price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 font-bold text-lg">Total: ₹{totalPrice.toFixed(2)}</div>

                        <div className="flex space-x-4 mt-6">
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
                            >
                                Confirm & Place Order
                            </button>
                            <button
                                onClick={() => setShowOrderPopup(false)}
                                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                Back to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
