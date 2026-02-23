import { FormEvent, useContext, useState } from "react";
import { ProductDatabaseProps, PurchaseSummary } from "../types";
import { NavLink } from "react-router-dom";
import { PurchaseContext } from "../context/PurchaseContextProvider";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const Products = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const { purchases, errorMessage } = useContext(PurchaseContext);
  const [error, setError] = useState("");

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDatabaseProps | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const [useProductFormVisible, setUseProductFormVisible] = useState(false);

  const purchaseSummary: Record<number, PurchaseSummary> = {};

  purchases.forEach((purchase) => {
    const productId = purchase.productId;

    if (!purchaseSummary[productId]) {
      purchaseSummary[productId] = {
        totalQuantity: 0,
        totalQuantityPending: 0,
        suppliers: new Set(),
        categoryName: purchase.categoryName || "N/A",
        productName: purchase.productName || "N/A",
        unitPrice: purchase.unitPrice || 0,
        categoryId: purchase.categoryId,
      };
    }

    if (purchase.purchaseStatusId === 2) {
      purchaseSummary[productId].totalQuantity += purchase.quantity;
      purchaseSummary[productId].suppliers!.add(purchase.supplierName);
    } else if (purchase.purchaseStatusId === 1) {
      purchaseSummary[productId].totalQuantityPending += purchase.quantity;
      purchaseSummary[productId].suppliers!.add(purchase.supplierName);
    }
  });

  const processedProducts = Object.entries(purchaseSummary).map(([id, summary]) => ({
    id: Number(id),
    productName: summary.productName,
    categoryName: summary.categoryName,
    totalQuantity: summary.totalQuantity,
    totalQuantityPending: summary.totalQuantityPending,
    suppliersList: Array.from(summary.suppliers!).join(", "),
    unitPrice: summary.unitPrice,
  }));

  const handleBuyAgain = (productId: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const lastPurchase = purchases
      .filter((p) => p.productId === productId)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())[0];

    if (lastPurchase) {
      setSelectedProduct({
        id: lastPurchase.productId,
        productName: lastPurchase.productName,
        suppliersList: lastPurchase.supplierName,
        purchaseDate: new Date().toISOString(),
        quantity: 0,
        unitPrice: lastPurchase.unitPrice,
        categoryName: lastPurchase.categoryName,
        categoryId: lastPurchase.categoryId,
      });
      setShowPurchaseForm(true);
    }
  };

  const handleCancelPurchase = () => {
    setShowPurchaseForm(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleSubmitPurchase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct) return;

    const supplierName =
      selectedProduct.suppliersList && selectedProduct.suppliersList.includes(",")
        ? selectedProduct.suppliersList.split(", ")[0]
        : selectedProduct.suppliersList || "";

    const purchaseData = {
      productName: selectedProduct.productName,
      categoryId: selectedProduct.categoryId,
      productId: selectedProduct.id,
      supplierName: supplierName,
      unitPrice: selectedProduct.unitPrice || 0,
      quantity,
      purchaseDate: new Date().toISOString(),
      purchaseStatusId: 1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        console.error("Error creating purchase:", error);
        setError("Failed to create purchase");
      } else {
        console.log("Purchase created successfully");
        setNotification(`Purchase created for ${purchaseData.productName}`);
        setTimeout(() => setNotification(null), 4000);
        handleCancelPurchase();
        setTimeout(() => window.location.reload(), 4000);
      }
    } catch (error) {
      console.error("Error creating purchase:", error);
      setError("Failed to create purchase");
    }
  };

  // const handleUseProduct = (productId: number) => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  //   console.log(productId);
  //   setUseProductFormVisible(true);
  // };

  const handleSubmitUseProduct = (e: FormEvent<HTMLFormElement>) => {
    setError("This function is not ready, click on cancel");
    e.preventDefault();
  };

  const handleCancelUseProduct = () => {
    setUseProductFormVisible(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="mb-4 text-center title bold-title">All Products</h2>

      <NavLink className="blue-button all-button mb-4 text-center md:self-end" to={"/newpurchase"}>
        New Purchase
      </NavLink>

      {errorMessage && <div className="text-center red-text">{errorMessage}</div>}
      {error && <div className="text-center red-text">{error}</div>}

      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {notification}
        </div>
      )}

      {showPurchaseForm && selectedProduct && (
        <form onSubmit={handleSubmitPurchase} className="mb-8 p-4 border border-gray-300 rounded-lg ">
          <div className="flex items-center mb-2">
            <label className="font-bold w-1/2">Product Name:</label>
            <p className="flex-grow">{selectedProduct.productName}</p>
          </div>

          <div className="flex items-center mb-2">
            <label className="font-bold w-1/2">Category:</label>
            <p className="flex-grow">{selectedProduct.categoryName}</p>
          </div>

          <div className="flex items-center mb-2">
            <label className="font-bold w-1/2">Unit Price: </label>
            <input
              type="number"
              value={selectedProduct.unitPrice}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  unitPrice: Number(e.target.value),
                })
              }
              required
              placeholder={selectedProduct.unitPrice.toString()}
              className="ml-2 border border-gray-300 p-1 flex-grow"
            />
          </div>

          <div className="flex items-center mb-2">
            <label className="font-bold w-1/2">Supplier Name: </label>
            <input
              type="text"
              value={selectedProduct.suppliersList.split(", ").pop()}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  suppliersList: e.target.value,
                })
              }
              required
              placeholder={selectedProduct.suppliersList.split(", ").pop()}
              className="ml-2 border border-gray-300 p-1 flex-grow"
            />
          </div>

          <div className="flex items-center mb-2">
            <label className="font-bold w-1/2">Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min="1"
              className="ml-2 border border-gray-300 p-1 flex-grow"
            />
          </div>

          <div className="mt-4 flex justify-center">
            <button type="submit" className="blue-button all-button mr-2">
              Save
            </button>
            <button type="button" onClick={handleCancelPurchase} className="grey-button all-button">
              Cancel
            </button>
          </div>
        </form>
      )}

      {useProductFormVisible && (
        <form
          onSubmit={handleSubmitUseProduct}
          className="mb-8 p-4 border border-gray-300 rounded-lg flex flex-col items-center"
        >
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min="1"
              className="ml-2 border border-gray-300 p-1"
            />
          </label>
          <div className="mt-4">
            <button type="submit" className="navy-button all-button mr-2">
              Deduct
            </button>
            <button type="button" onClick={handleCancelUseProduct} className="grey-button all-button">
              Cancel
            </button>
          </div>
          {errorMessage && <p className="red-text">{errorMessage}</p>}
        </form>
      )}

      {processedProducts.length > 0 ? (
        <div className="overflow-x-auto w-full">
          {/* --- Desktop View --- */}
          <table className="min-w-full border-collapse border border-gray-300 hidden lg:table">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">In stock (kg)</th>
                <th className="border border-gray-300 p-2">Pending orders (kg)</th>
                <th className="border border-gray-300 p-2">Supplier Name(s)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2 w-1/7 whitespace-normal">{product.productName}</td>
                  <td className="border border-gray-300 p-2 w-1/7 whitespace-normal">
                    {product.categoryName || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 w-1/7 whitespace-normal">{product.totalQuantity}</td>
                  <td className="border border-gray-300 p-2 w-1/7 whitespace-normal green-text">
                    {product.totalQuantityPending}
                  </td>
                  <td className="border border-gray-300 p-2 w-1/7 whitespace-normal ">{product.suppliersList}</td>

                  <td className="border border-gray-300 p-2 w-2/7">
                    <div className="flex flex-col md:flex-row md:space-x-2">
                      <button
                        onClick={() => handleBuyAgain(product.id)}
                        className="blue-button all-button mb-2 md:mb-0"
                      >
                        Purchase Again
                      </button>
                      {/* <button
                        onClick={() => handleUseProduct(product.id)}
                        className="navy-button all-button mb-2 md:mb-0"
                      >
                        Use Product
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Mobile View --- */}
          <div className="block lg:hidden ">
            {processedProducts.map((product) => (
              <div key={product.id} className="border border-gray-300 mb-4 p-4">
                <h3 className="font-bold medium-title">{product.productName}</h3>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3 mr-2">Category:</label>
                  <p>{product.categoryName}</p>
                </div>
                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3 mr-2">In Stock:</label>
                  <p>{product.totalQuantity} kg</p>
                </div>
                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3 mr-2">Pending orders:</label>
                  <p className="green-text">{product.totalQuantityPending} kg</p>
                </div>

                <div className="flex items-center mb-2">
                  <label className="font-bold w-1/3 mr-2">Supplier(s):</label>
                  <p>{product.suppliersList}</p>
                </div>

                <div className="flex items-center mb-2">
                  <button onClick={() => handleBuyAgain(product.id)} className="blue-button all-button mr-2 mt-2">
                    Purchase Again
                  </button>
                  {/* <button
                    onClick={() => handleUseProduct(product.id)}
                    className="navy-button all-button mt-2"
                  >
                    Use Product
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center w-full p-4">No products have been added yet.</p>
      )}
    </div>
  );
};

export default Products;
