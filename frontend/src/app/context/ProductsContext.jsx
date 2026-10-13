import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getProductsRequest } from "../../api/api";

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

// Carga el menú (sabores, bases y toppings) desde el backend una sola vez
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(() => {
    setLoading(true);
    return getProductsRequest()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sabores = products.filter((p) => p.tipo === "sabor");
  const bases = products.filter((p) => p.tipo === "base");
  const toppings = products.filter((p) => p.tipo === "topping");

  return (
    <ProductsContext.Provider value={{ sabores, bases, toppings, loading, error, reload: loadProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
