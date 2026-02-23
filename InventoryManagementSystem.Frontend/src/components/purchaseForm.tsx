import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { CategoryProps, ProductProps } from "../types";
import { fetchCategories } from "../utils/fetchCategory";
import { useNavigate } from "react-router-dom";
import { PurchaseContext } from "../context/PurchaseContextProvider";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const PurchaseForm = () => {
  const [product, setProduct] = useState<ProductProps>({
    productName: "",
    supplierName: "",
    purchaseDate: "",
    quantity: 0,
    unitPrice: 0,
    categoryId: 0,
  });

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { setShouldFetchData } = useContext(PurchaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const getCategories = async () => {
      const { result, errorMessage } = await fetchCategories();

      if (errorMessage) {
        setErrorMessage(errorMessage);
      } else if (isMounted) {
        setCategories(result || []);
      }
    };

    getCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = Number(e.target.value);
    setProduct((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedProduct = {
      ProductName: product.productName,
      SupplierName: product.supplierName,
      PurchaseDate: product.purchaseDate,
      Quantity: product.quantity,
      UnitPrice: product.unitPrice,
      CategoryId: product.categoryId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to create purchase");
      }
      setShouldFetchData(true);
      setProduct({
        productName: "",
        supplierName: "",
        purchaseDate: "",
        quantity: 0,
        unitPrice: 0,
        categoryId: 0,
      });
      setErrorMessage("");
      navigate("/purchases", { 
        state: { message: `Purchase created for ${product.productName}` }
      })
    } catch (error) {
      console.error("Error creating purchase:", error);
      setErrorMessage("Failed to create purchase.");
    }
  };

  const handleCancel = () => {
    setProduct({
      productName: "",
      supplierName: "",
      purchaseDate: "",
      quantity: 0,
      unitPrice: 0,
      categoryId: 0,
    });
    setErrorMessage("");

    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="mb-12 text-center title bold-title">New Purchase</h2>
      {errorMessage && <div className="red-text mb-4">{errorMessage}</div>}

      <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
        <div className="flex-1">
          <label htmlFor="product-name" className="block text-sm font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="product-name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="supplier-name" className="block text-sm font-medium">
            Supplier Name
          </label>
          <input
            type="text"
            id="supplier-name"
            name="supplierName"
            value={product.supplierName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="categoryId"
            value={product.categoryId}
            onChange={handleCategoryChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="purchase-date" className="block text-sm font-medium">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchase-date"
            name="purchaseDate"
            value={product.purchaseDate}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8 mb-10">
        <div className="flex-1">
          <label htmlFor="quantity" className="block text-sm font-medium">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="unit-price" className="block text-sm font-medium">
            Unit Price
          </label>
          <input
            type="number"
            id="unit-price"
            name="unitPrice"
            value={product.unitPrice}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="flex gap-12 mt-4 justify-center">
        <button type="submit" className="blue-button all-button">
          Save
        </button>

        <button
          type="button"
          className="grey-button all-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;
