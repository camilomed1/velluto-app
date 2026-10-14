import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getOrdersRequest,
  updateOrderStatusRequest,
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../../api/api";
import { useProducts } from "../context/ProductsContext";
import { OrderCard, formatCOP } from "../components/OrderCard";

const ESTADOS = ["pendiente", "preparando", "en camino", "entregado", "cancelado"];
const TIPOS = [
  { value: "sabor", label: "Sabores", singular: "sabor" },
  { value: "base", label: "Bases", singular: "base" },
  { value: "topping", label: "Toppings", singular: "topping" },
];
const CATEGORIAS = ["Clásicos", "Cremosos", "Frutales", "Premium"];

// ---------- Estilos (mismos colores y formas del resto de la página) ----------

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 3rem;
  line-height: 1.1;
  margin: 0.5rem 0 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const TabBtn = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  background: ${(props) => (props.$active ? props.theme.colors.primary : "white")};
  color: ${(props) => (props.$active ? "white" : props.theme.colors.text)};
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : "#eee")};

  &:hover {
    background: ${(props) => (props.$active ? props.theme.colors.primary : "#f8f8f8")};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Panel = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.8rem 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};

  h3 {
    font-family: ${({ theme }) => theme.fonts.title};
    margin-bottom: 1.2rem;
  }
`;

const Extra = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.dark};

  strong { color: ${({ theme }) => theme.colors.text}; }
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-family: inherit;
  font-weight: 600;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  align-items: end;

  label {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $light }) => ($light ? "white" : theme.colors.primary)};
  color: ${({ theme, $light }) => ($light ? theme.colors.text : "white")};
  border: 1px solid ${({ theme, $light }) => ($light ? theme.colors.border : theme.colors.primary)};
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${({ theme, $light }) => ($light ? theme.colors.background : theme.colors.dark)};
  }
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 140px auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  opacity: ${({ $off }) => ($off ? 0.5 : 1)};

  small { display: block; color: ${({ theme }) => theme.colors.dark}; }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  text-align: center;
  padding: 1rem;
`;

// ---------- Pedidos ----------

function PedidosTab() {
  const [orders, setOrders] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [error, setError] = useState("");

  useEffect(() => {
    getOrdersRequest().then(setOrders).catch((err) => setError(err.message));
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const updated = await updateOrderStatusRequest(id, status);
      setOrders(orders.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  const visibles = filtro === "todos" ? orders : orders.filter((o) => o.status === filtro);

  return (
    <>
      <Tabs>
        {["todos", ...ESTADOS].map((e) => (
          <TabBtn key={e} $active={filtro === e} onClick={() => setFiltro(e)}>
            {e.charAt(0).toUpperCase() + e.slice(1)} ({e === "todos" ? orders.length : orders.filter((o) => o.status === e).length})
          </TabBtn>
        ))}
      </Tabs>

      {error && <Message>{error}</Message>}
      {visibles.length === 0 && !error && <Message>No hay pedidos.</Message>}

      <List>
        {visibles.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            extra={
              <Extra>
                <div>
                  Cliente: <strong>{order.user?.username || "Usuario eliminado"}</strong> · {order.user?.email} · Tel: {order.delivery.telefono}
                </div>
                <Select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                  {ESTADOS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Extra>
            }
          />
        ))}
      </List>
    </>
  );
}

// ---------- Productos ----------

const EMPTY_PRODUCT = { tipo: "sabor", name: "", price: "", category: "Clásicos", description: "", image: "", color: "" };

function ProductosTab() {
  const { reload } = useProducts();
  const [products, setProducts] = useState([]);
  const [tipo, setTipo] = useState("sabor");
  const [nuevo, setNuevo] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState("");

  const load = () => getProductsRequest(true).then(setProducts).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  // Después de cada cambio recargamos el panel y el menú público
  const run = async (action) => {
    setError("");
    try {
      await action();
      await load();
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    run(async () => {
      await createProductRequest({ ...nuevo, tipo, price: Number(nuevo.price) });
      setNuevo({ ...EMPTY_PRODUCT, tipo });
    });
  };

  const handlePrice = (product, value) => {
    const price = Number(value);
    if (value === "" || price === product.price || price < 0) return;
    run(() => updateProductRequest(product._id, { price }));
  };

  const handleDelete = (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;
    run(() => deleteProductRequest(product._id));
  };

  const change = (e) => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  return (
    <>
      <Tabs>
        {TIPOS.map((t) => (
          <TabBtn key={t.value} $active={tipo === t.value} onClick={() => setTipo(t.value)}>
            {t.label} ({products.filter((p) => p.tipo === t.value).length})
          </TabBtn>
        ))}
      </Tabs>

      {error && <Message>{error}</Message>}

      <List>
        <Panel>
          <h3>Agregar {TIPOS.find((t) => t.value === tipo).singular}</h3>
          <FormGrid onSubmit={handleCreate}>
            <div>
              <label>Nombre</label>
              <Input name="name" value={nuevo.name} onChange={change} required />
            </div>
            <div>
              <label>Precio (COP)</label>
              <Input name="price" type="number" min="0" step="100" value={nuevo.price} onChange={change} required />
            </div>
            {tipo === "sabor" && (
              <>
                <div>
                  <label>Categoría</label>
                  <Select name="category" value={nuevo.category} onChange={change} style={{ width: "100%" }}>
                    {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </div>
                <div>
                  <label>Imagen (ruta)</label>
                  <Input name="image" value={nuevo.image} onChange={change} placeholder="/sabores/fresa.png" />
                </div>
                <div>
                  <label>Color</label>
                  <Input name="color" type="color" value={nuevo.color || "#FFF9C4"} onChange={change} style={{ height: "42px", padding: "0.3rem" }} />
                </div>
              </>
            )}
            {tipo !== "topping" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Descripción</label>
                <Input name="description" value={nuevo.description} onChange={change} />
              </div>
            )}
            <Button type="submit">Agregar</Button>
          </FormGrid>
        </Panel>

        <Panel>
          <h3>{TIPOS.find((t) => t.value === tipo).label}</h3>
          {products
            .filter((p) => p.tipo === tipo)
            .map((p) => (
              <ProductRow key={p._id} $off={!p.disponible}>
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.category || formatCOP(p.price)}</small>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={p.price}
                  onBlur={(e) => handlePrice(p, e.target.value)}
                  title="Cambia el precio y haz clic afuera para guardar"
                />
                <Button $light onClick={() => run(() => updateProductRequest(p._id, { disponible: !p.disponible }))}>
                  {p.disponible ? "Ocultar" : "Mostrar"}
                </Button>
                <Button $light onClick={() => handleDelete(p)}>Eliminar</Button>
              </ProductRow>
            ))}
        </Panel>
      </List>
    </>
  );
}

// ---------- Página ----------

const SECCIONES = [
  { key: "pedidos", label: "Pedidos" },
  { key: "productos", label: "Productos" },
];

export function Admin() {
  const [seccion, setSeccion] = useState("pedidos");

  return (
    <PageWrapper>
      <Eyebrow>Panel de administración</Eyebrow>
      <Title>Velluto Admin</Title>

      <Tabs>
        {SECCIONES.map((s) => (
          <TabBtn key={s.key} $active={seccion === s.key} onClick={() => setSeccion(s.key)}>
            {s.label}
          </TabBtn>
        ))}
      </Tabs>

      {seccion === "pedidos" && <PedidosTab />}
      {seccion === "productos" && <ProductosTab />}
    </PageWrapper>
  );
}
