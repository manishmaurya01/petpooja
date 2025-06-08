import React, { useEffect, useState } from "react";
import { auth, db } from "../../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { format } from "date-fns"; // optional, install with npm i date-fns

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null); // track cancel loading

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });

        setOrders(fetchedOrders);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // Cancel order handler
  async function cancelOrder(order) {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel order ${order.id}?`
    );
    if (!confirmCancel) return;

    try {
      setCancelingId(order.id);

      // 1. Add order data to canceledOrders collection
      await addDoc(collection(db, "canceledOrders"), {
        ...order,
        canceledAt: new Date(),
      });

      // 2. Delete the order from orders collection
      await deleteDoc(doc(db, "orders", order.id));

      // 3. Update UI locally by filtering out canceled order
      setOrders((prev) => prev.filter((o) => o.id !== order.id));

      alert("Order canceled successfully.");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order, please try again.");
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {orders.map((order) => {
        // Format Firestore Timestamp to readable date
        const placedAtDate = order.placedAt?.toDate
          ? order.placedAt.toDate()
          : null;
        const formattedDate = placedAtDate
          ? format(placedAtDate, "PPP p")
          : "N/A";

        return (
          <div
            key={order.id}
            className="border rounded-md p-4 mb-3 shadow-sm hover:shadow-md transition"
          >
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {formattedDate}
            </p>
            <p>
              <strong>Status:</strong> {order.status || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {order.address || "N/A"}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2) || "0.00"}
            </p>

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside ml-5">
                {order.items?.map((item, idx) => (
                  <li key={item.id || idx}>
                    {item.food_name} x {item.quantity} - ₹
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => cancelOrder(order)}
              disabled={cancelingId === order.id}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {cancelingId === order.id ? "Canceling..." : "Cancel Order"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default OrderList;
