import { ReactElement, createContext, useEffect, useState } from "react";
import { PurchaseProps } from "../types";
import { fetchPurchases } from "../utils/fetchPurchases";
import { API_BASE_URL } from "../utils/apiBaseUrl";

interface IPurchaseContex {
  purchases: PurchaseProps[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseProps[]>>;
  errorMessage: string;
  setShouldFetchData: React.Dispatch<React.SetStateAction<boolean>>;
  updatePurchaseStatus: (id: number, newStatusId: number) => void;
}

interface IPurchaseContextProvider {
  children: ReactElement;
}

export const PurchaseContext = createContext({} as IPurchaseContex);

export function PurchaseContextProvider({ children }: IPurchaseContextProvider): ReactElement {
  const [purchases, setPurchases] = useState<PurchaseProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const loadPurchases = async () => {
    const { result, errorMessage } = await fetchPurchases();
    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage("");
      setPurchases(result || []);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [shouldFetchData]);

  const updatePurchaseStatus = async (id: number, newStatusId: number) => {
    setPurchases((prevPurchases) =>
      prevPurchases.map((purchase) => (purchase.id === id ? { ...purchase, purchaseStatusId: newStatusId } : purchase)),
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/purchase/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatusId),
      });

      if (!response.ok) {
        setErrorMessage("Failed to update purchase status");
        throw new Error("Failed to update purchase status");
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

  const values: IPurchaseContex = {
    purchases,
    setPurchases,
    errorMessage,
    setShouldFetchData,
    updatePurchaseStatus,
  };

  return <PurchaseContext.Provider value={values}>{children}</PurchaseContext.Provider>;
}
