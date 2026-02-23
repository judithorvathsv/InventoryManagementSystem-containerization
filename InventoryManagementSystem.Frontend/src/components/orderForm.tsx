import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { OrderProps, ProductDatabaseProps } from "../types";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../utils/fetchProduct";
import { OrderContext } from "../context/OrderContextProvider";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const OrderForm = () => {
  const { updateFromDatabase } = useContext(OrderContext);
  const [order, setOrder] = useState<OrderProps>({
    productId: 0,
    productName: "",
    customerName: "",
    orderDate: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState<ProductDatabaseProps[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const getProducts = async () => {
      const { result, errorMessage } = await fetchProducts();

      if (errorMessage) {
        setErrorMessage(errorMessage);
      } else if (isMounted) {
        setProducts(result || []);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder((prev) => {
      const updatedValue =
        name === "quantity" || name === "unitPrice" ? Number(value) : value;

      const updatedOrder = {
        ...prev,
        [name]: updatedValue,
      };

      if (updatedOrder.quantity > 0 && updatedOrder.unitPrice > 0) {
        updatedOrder.totalPrice =
          updatedOrder.quantity * updatedOrder.unitPrice;
      } else {
        updatedOrder.totalPrice = 0;
      }
      return updatedOrder;
    });
  };

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = Number(e.target.value);
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId
    );

    if (selectedProduct) {
      setOrder((prev) => ({
        ...prev,
        productId: selectedProductId,
        productName: selectedProduct.productName,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders`,  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        console.error("Error creating order.");
        setErrorMessage("Failed to create order.");
      }
      else{
        setOrder({
          productId: 0,
          productName: "",
          customerName: "",
          orderDate: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        });
        setErrorMessage("");
        updateFromDatabase();
        navigate("/orders", { 
          state: { message: `Order created for ${order.productName}` }
        })
      } 
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage("Failed to create order.");
    }
  };

  const handleCancel = () => {
    setOrder({
      productId: 0,
      productName: "",
      customerName: "",
      orderDate: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
    setErrorMessage("");
    navigate("/orders");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="mb-12 text-center title bold-title">New Order</h2>
      {errorMessage && <div className="red-text mb-4">{errorMessage}</div>}

      <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
        <div className="flex-1">
          <label htmlFor="product" className="block text-sm font-medium">
            Product
          </label>
          <select
            id="product"
            name="productId"
            value={order.productId}
            onChange={handleProductChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.productName} ({product.categoryName})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="customer-name" className="block text-sm font-medium">
            Customer Name
          </label>
          <input
            type="text"
            id="customer-name"
            name="customerName"
            value={order.customerName}
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
            value={order.quantity}
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
            value={order.unitPrice}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="order-date" className="block text-sm font-medium">
            Order Date
          </label>
          <input
            type="date"
            id="order-date"
            name="orderDate"
            value={order.orderDate}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <label htmlFor="total-price" className="block text-sm font-medium">
            Total Price
          </label>
          <input
            type="number"
            id="total-price"
            name="totalPrice"
            value={order.totalPrice}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
            readOnly
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

export default OrderForm;
