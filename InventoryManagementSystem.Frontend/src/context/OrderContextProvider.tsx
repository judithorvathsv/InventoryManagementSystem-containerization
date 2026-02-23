import { ReactElement, createContext, useEffect, useState } from "react";
import { OrderProps } from "../types";
import { fetchOrders } from "../utils/fetchOrders";
import { API_BASE_URL } from "../utils/apiBaseUrl";

interface IOrderContex {
  orders: OrderProps[];
  setOrders: React.Dispatch<React.SetStateAction<OrderProps[]>>;
  errorMessage: string;
  setShouldFetchData: React.Dispatch<React.SetStateAction<boolean>>;
  updateOrderStatus: (id: number, newStatusId: number) => void;
  updateFromDatabase: () => void;
}

interface IOrderContextProvider {
  children: ReactElement;
}

export const OrderContext = createContext({} as IOrderContex);

export function OrderContextProvider({ children }: IOrderContextProvider): ReactElement {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const updateFromDatabase = () => {
    setShouldFetchData(!shouldFetchData);
  };

  const loadOrders = async () => {
    const { result, errorMessage } = await fetchOrders();
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage("");
      setOrders(result || []);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [shouldFetchData]);

  const updateOrderStatus = async (id: number, newStatusId: number) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, orderStatusId: newStatusId } : order)));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatusId),
      });

      if (!response.ok) {
        setErrorMessage("Failed to update order status");
        throw new Error("Failed to update order status");
      }

      setShouldFetchData(!shouldFetchData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error: ", error);
        setErrorMessage(error.message);
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const values: IOrderContex = {
    orders,
    setOrders,
    errorMessage,
    setShouldFetchData,
    updateOrderStatus,
    updateFromDatabase,
  };

  return <OrderContext.Provider value={values}>{children}</OrderContext.Provider>;
}
