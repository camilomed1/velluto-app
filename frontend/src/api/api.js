// Cliente para hablar con el backend de Velluto.
// credentials: "include" hace que el navegador envíe la cookie del token.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const request = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text && res.headers.get("content-type")?.includes("application/json") ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "No pudimos conectar con el servidor");
  }
  return data;
};

// Auth
export const registerRequest = (user) => request("/register", { method: "POST", body: user });
export const loginRequest = (user) => request("/login", { method: "POST", body: user });
export const logoutRequest = () => request("/logout", { method: "POST" });
export const profileRequest = () => request("/profile");

// Mi cuenta
export const updateProfileRequest = (data) => request("/profile", { method: "PUT", body: data });
export const changePasswordRequest = (data) => request("/profile/password", { method: "PUT", body: data });
export const addAddressRequest = (address) => request("/profile/direcciones", { method: "POST", body: address });
export const updateAddressRequest = (id, address) => request(`/profile/direcciones/${id}`, { method: "PUT", body: address });
export const deleteAddressRequest = (id) => request(`/profile/direcciones/${id}`, { method: "DELETE" });

// Productos
export const getProductsRequest = (todos = false) => request(`/productos${todos ? "?todos=true" : ""}`);
export const createProductRequest = (product) => request("/productos", { method: "POST", body: product });
export const updateProductRequest = (id, product) => request(`/productos/${id}`, { method: "PUT", body: product });
export const deleteProductRequest = (id) => request(`/productos/${id}`, { method: "DELETE" });

// Órdenes
export const createOrderRequest = (order) => request("/ordenes", { method: "POST", body: order });
export const getMyOrdersRequest = () => request("/ordenes/mias");
export const getOrdersRequest = () => request("/ordenes");
export const updateOrderStatusRequest = (id, status) => request(`/ordenes/${id}/estado`, { method: "PUT", body: { status } });
