import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../context/OrderContextProvider";
import { NavLink, useLocation } from "react-router-dom";
import { formatDate } from "../utils/formatDateTime";

const Orders = () => {
  const { orders, errorMessage } = useContext(OrderContext);

  const location = useLocation();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.message) {
      setNotification(location.state.message);
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location])

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="mb-4 text-center title bold-title">All Orders</h2>

      <NavLink
        className="blue-button all-button mb-4 text-center md:self-end"
        to={"/neworder"}
      >
        New Order
      </NavLink>

      {errorMessage && <div className="text-center red-text">{errorMessage}</div>}

      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {notification}
        </div>
      )}

      {orders.length > 0 ? (
        <div className="overflow-x-auto w-full">
          {/* --- Desktop View --- */}
          <table className="min-w-full border-collapse border border-gray-300 hidden lg:table">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Category Name</th>
                <th className="border border-gray-300 p-2">Customer Name</th>
                <th className="border border-gray-300 p-2">Quantity (kg)</th>
                <th className="border border-gray-300 p-2">Order Date</th>
                <th className="border border-gray-300 p-2">
                  Total Price (sek)
                </th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-300 p-2">{order.id}</td>
                  <td className="border border-gray-300 p-2">
                    {order.productName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.customerName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.quantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {(order.quantity * order.unitPrice).toFixed(2)}
                  </td>
                  <td
                    className={`border border-gray-300 p-2 ${
                      order.status === "Processing"
                        ? "green-text"
                        : order.status === "Cancelled"
                        ? "red-text"
                        : ""
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Mobile View --- */}
          <div className="block lg:hidden">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-300 mb-4 p-4">
                <div className="flex flex-wrap items-center mb-2">
                  <label className="font-bold w-1/3">Order ID:</label>
                  <p className="w-2/3">{order.id}</p>
                </div>
                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Product:</label>
                  <p className="w-2/3">{order.productName}</p>
                </div>
                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Product:</label>
                  <p className="w-2/3">{order.categoryName}</p>
                </div>
                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Customer:</label>
                  <p className="w-2/3">{order.customerName} </p>
                </div>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Quantity:</label>
                  <p className="w-2/3">{order.quantity} kg</p>
                </div>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Date:</label>
                  <p className="w-2/3">{formatDate(order.orderDate)}</p>
                </div>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Total Price:</label>
                  <p className="w-2/3">
                    {(order.quantity * order.unitPrice).toFixed(2)} sek
                  </p>
                </div>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3">Status:</label>
                  <p
                    className={`w-2/3 ${
                      order.status === "Processing"
                        ? "green-text"
                        : order.status === "Cancelled"
                        ? "red-text"
                        : ""
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center w-full p-4">No order have been made yet.</p>
      )}
    </div>
  );
};

export default Orders;
