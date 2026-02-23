import { CategoryProps } from "../types";
import { API_BASE_URL } from "./apiBaseUrl";

export const fetchCategories = async (): Promise<{
  result?: CategoryProps[];
  errorMessage?: string;
}> => {
  let errorMessage = "";
  let result: CategoryProps[] = [];

  try { 
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`);

    if (!response.ok) {  
      throw new Error("Failed to fetch the categories");
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
