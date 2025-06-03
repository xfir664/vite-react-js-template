import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./scss/index.scss";
import App from "./App";
import ErrorPage404 from "./error-page-404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage404 />,
    children: [
      {
        path: "products/:productId",
        element: <Product />,
      },
    ],
  },
]);

function Product() {
  const product = {
    name: "Product",
    cost: 400,
    amount: 5,
  };
  return (
    <div>
      <h2>Product page</h2>
      <p>Name: {product.name}</p>
      <p>Cost: {product.cost}</p>
      <p>Amount: {product.amount}</p>
    </div>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element with id "root" not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
