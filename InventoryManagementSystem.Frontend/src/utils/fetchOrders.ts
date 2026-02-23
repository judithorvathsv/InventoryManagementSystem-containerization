import { OrderProps } from "../types";
import { API_BASE_URL } from "./apiBaseUrl";

export const fetchOrders = async (): Promise<{
  result?: OrderProps[];
  errorMessage?: string;
}> => {
  let errorMessage = "";
  let result: OrderProps[] = [];

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders`);
    
    if (!response.ok) {
      throw new Error(errorMessage);
    }

    result = await response.json();    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error: ", error);
      errorMessage = error.message;
    } else {
      console.error("Unexpected error:", error);
      errorMessage = "An unexpected error occurred";
    }
  }

  return { result, errorMessage };
};
