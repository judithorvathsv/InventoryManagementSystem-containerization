import { ProductDatabaseProps } from "../types";
import { API_BASE_URL } from "./apiBaseUrl";

export const fetchProducts = async (): Promise<{
  result?: ProductDatabaseProps[];
  errorMessage?: string;
}> => {
  let errorMessage = "";
  let result: ProductDatabaseProps[] = [];

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`);

    if (!response.ok) {   
      throw new Error("Failed to fetch the products");
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
