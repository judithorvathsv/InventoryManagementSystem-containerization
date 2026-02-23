import { useContext, useState } from "react";
import { OrderContext } from "../context/OrderContextProvider";
import { OrderProps } from "../types";
import { formatDate } from "../utils/formatDateTime";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const OutgoingOrders = () => {
  const { orders, errorMessage, updateOrderStatus } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const [actionType, setActionType] = useState("");
  const [error, setError] = useState("");

  const outgoingOrders = orders.filter((order) => order.orderStatusId === 1);

  const handleCloseForm = () => {
    setSelectedOrder(null);
    setActionType("");
    setError("");
  };

  const handleSendOrder = (order: OrderProps) => {
    setSelectedOrder(order);
    setActionType("send");
  };

  const handleCancelOrder = (order: OrderProps) => {
    setSelectedOrder(order);
    setActionType("delete");
  };

  const handleConfirmSend = async () => {
    if (selectedOrder) {
      const request = {
        ProductName: selectedOrder.productName,
        ProductId: selectedOrder.productId,
        Quantity: selectedOrder.quantity,
        CustomerName: selectedOrder.customerName,
        OrderDate: selectedOrder.orderDate,
        UnitPrice: selectedOrder.unitPrice,
      };

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/orders/${selectedOrder.id}/send`,       
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData);
          throw new Error(errorData.message || "Failed to send order");
        }

        handleCloseForm();
        await updateOrderStatus(selectedOrder.id!, 2);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error: ", error);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder.id!, 3);
      handleCloseForm();
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="mb-12 text-center title bold-title">Outgoing Orders</h2>

      {errorMessage && (
        <div className="text-center red-text">{errorMessage}</div>
      )}
      {error && <div className="text-center red-text">{error}</div>}

      {selectedOrder && (
        <div className="mt-4 mb-8 p-4 border rounded-lg bg-white shadow-md">
          {actionType === "send" && (
            <div className="flex flex-col items-center">
              <h3 className="medium-title bold-title">
                Order ID: {selectedOrder.id}
              </h3>
              <p>Are you sure you want to send the order?</p>
              <div className="mt-4">
                <button
                  onClick={handleConfirmSend}
                  className="blue-button all-button mr-2"
                >
                  Confirm Send Order
                </button>
                <button
                  onClick={handleCloseForm}
                  className="grey-button all-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {actionType === "delete" && (
            <div className="flex flex-col items-center">
              <h3 className="medium-title bold-title">
                Order ID: {selectedOrder.id}
              </h3>
              <p>Are you sure you want to cancel this order?</p>
              <div className="mt-4">
                <button
                  onClick={handleConfirmDelete}
                  className="navy-button all-button mr-2"
                >
                  Confirm Cancel Order
                </button>
                <button
                  onClick={handleCloseForm}
                  className="grey-button all-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {outgoingOrders.length > 0 ? (
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
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {outgoingOrders.map((order) => (
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

                  <td className="border border-gray-300 p-2 w-2/7">
                    <div className="flex flex-col md:flex-row md:space-x-2">
                      <button
                        onClick={() => handleSendOrder(order)}
                        className="blue-button all-button mb-2 md:mb-0"
                      >
                        Send Order
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="navy-button all-button mb-2 md:mb-0"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Mobile View --- */}
          <div className="block lg:hidden">
            {outgoingOrders.map((order) => (
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
                  <button
                    onClick={() => handleSendOrder(order)}
                    className="blue-button all-button mr-2 mt-2"
                  >
                    Send Order
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order)}
                    className="navy-button all-button mt-2"
                  >
                    Cancel Order
                  </button>
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
export default OutgoingOrders;
