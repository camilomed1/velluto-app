import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getOrdersRequest,
  updateOrderStatusRequest,
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  uploadImageRequest,
  imageUrl,
  getDomiciliariosRequest,
  assignDomiciliarioRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
  createDomiciliarioRequest,
  deleteDomiciliarioRequest,
} from "../../api/api";
import { useProducts } from "../context/ProductsContext";
import { OrderCard, formatCOP, statusColors } from "../components/OrderCard";

const ESTADOS = ["pendiente", "preparando", "en camino", "entregado", "cancelado"];
const TIPOS = [
  { value: "sabor", label: "Sabores", singular: "sabor" },
  { value: "base", label: "Bases", singular: "base" },
  { value: "topping", label: "Toppings", singular: "topping" },
];

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme, $light }) => ($light ? "white" : theme.colors.primary)};
  }
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 470px;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  opacity: ${({ $off }) => ($off ? 0.5 : 1)};

  small { display: block; color: ${({ theme }) => theme.colors.dark}; }

  @media (max-width: 700px) {
    grid-template-columns: 1fr 120px;
  }
`;

// Selector pequeño de categoría dentro de la fila del sabor
const CategorySelect = styled.select`
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.dark};
  cursor: pointer;
  text-decoration: underline dotted;

  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

const ImagePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  small {
    color: ${({ theme }) => theme.colors.dark};
    font-size: 0.8rem;
  }
`;

// Miniatura de la foto; al tocarla se abre el selector de archivos
const Thumb = styled.div`
  flex-shrink: 0;
  width: ${({ $small }) => ($small ? "48px" : "64px")};
  height: ${({ $small }) => ($small ? "48px" : "64px")};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  transition: 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.85;
  }
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  button {
    padding: 0.55rem 0.9rem;
    font-size: 0.85rem;
  }

  @media (max-width: 700px) {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  text-align: center;
  padding: 1rem;
`;

// ---------- Pedidos ----------

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

// Cada cuadro es un filtro: muestra cuántos pedidos hay en ese estado
const StatTile = styled.button`
  text-align: left;
  padding: 1rem 1.1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) => ($active ? theme.colors.background : "white")};
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-left: 6px solid ${({ $status, theme }) => ($status ? statusColors($status, theme).bg : theme.colors.primary)};
  font-family: inherit;
  cursor: pointer;
  transition: 0.2s ease;

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.dark};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const OrderPanel = styled.div`
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.2rem;
`;

const InfoBlock = styled.div`
  label,
  > span {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.3rem;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.dark};
  }

  a {
    color: ${({ theme }) => theme.colors.dark};
  }

  select {
    width: 100%;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Hint = styled.small`
  color: ${({ theme }) => theme.colors.dark};
`;

// Siguiente paso de cada estado (lo que el admin normalmente hace después)
const SIGUIENTE = {
  pendiente: { status: "preparando", label: "Empezar a preparar" },
  preparando: { status: "en camino", label: "Enviar al domicilio" },
  "en camino": { status: "entregado", label: "Marcar entregado" },
};

const FILTROS = [
  { key: "activos", label: "Activos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "preparando", label: "Preparando" },
  { key: "en camino", label: "En camino" },
  { key: "entregado", label: "Entregados" },
  { key: "cancelado", label: "Cancelados" },
  { key: "todos", label: "Todos" },
];

const ACTIVOS = ["pendiente", "preparando", "en camino"];

function PedidosTab() {
  const [orders, setOrders] = useState([]);
  const [domis, setDomis] = useState([]);
  const [filtro, setFiltro] = useState("activos");
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([getOrdersRequest(), getDomiciliariosRequest()])
      .then(([o, d]) => {
        setOrders(o);
        setDomis(d);
      })
      .catch((err) => setError(err.message));

  // Se actualiza solo cada 30 segundos para ver pedidos nuevos
  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const replace = (updated) => setOrders((list) => list.map((o) => (o._id === updated._id ? updated : o)));

  const changeStatus = async (order, status) => {
    setError("");
    if (status === "en camino" && !order.domiciliario) return setError(`Asigna un domiciliario al pedido ${order.orderNumber} antes de enviarlo`);
    if (status === "cancelado" && !window.confirm(`¿Cancelar el pedido ${order.orderNumber}?`)) return;
    try {
      replace(await updateOrderStatusRequest(order._id, status));
    } catch (err) {
      setError(err.message);
    }
  };

  const changeDomiciliario = async (order, domiciliario) => {
    setError("");
    try {
      replace(await assignDomiciliarioRequest(order._id, domiciliario || null));
    } catch (err) {
      setError(err.message);
    }
  };

  const contar = (key) =>
    key === "todos" ? orders.length : key === "activos" ? orders.filter((o) => ACTIVOS.includes(o.status)).length : orders.filter((o) => o.status === key).length;

  const visibles = orders.filter((o) => (filtro === "todos" ? true : filtro === "activos" ? ACTIVOS.includes(o.status) : o.status === filtro));
  // En los activos, primero los que llevan más tiempo esperando
  if (filtro === "activos") visibles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <>
      <StatsGrid>
        {FILTROS.map((f) => (
          <StatTile key={f.key} $active={filtro === f.key} $status={ESTADOS.includes(f.key) ? f.key : null} onClick={() => setFiltro(f.key)}>
            <strong>{contar(f.key)}</strong>
            <span>{f.label}</span>
          </StatTile>
        ))}
      </StatsGrid>

      {error && <Message>{error}</Message>}
      {visibles.length === 0 && !error && (
        <Panel>
          <Message>{filtro === "activos" ? "No hay pedidos activos. ¡Todo al día!" : "No hay pedidos en esta lista."}</Message>
        </Panel>
      )}

      <List>
        {visibles.map((order) => {
          const terminado = ["entregado", "cancelado"].includes(order.status);
          const siguiente = SIGUIENTE[order.status];
          const faltaDomi = siguiente?.status === "en camino" && !order.domiciliario;

          return (
            <OrderCard
              key={order._id}
              order={order}
              onStepClick={(status) => changeStatus(order, status)}
              extra={
                <OrderPanel>
                  <InfoGrid>
                    <InfoBlock>
                      <span>Cliente</span>
                      <strong>{order.delivery.nombre || order.user?.username}</strong>
                      <small>
                        Tel: <a href={`tel:${order.delivery.telefono}`}>{order.delivery.telefono}</a>
                      </small>
                      <small>{order.user ? `Cuenta: ${order.user.email}` : "Pidió sin cuenta"}</small>
                    </InfoBlock>

                    <InfoBlock>
                      <label htmlFor={`domi-${order._id}`}>Domiciliario</label>
                      {terminado ? (
                        <strong>{order.domiciliario?.username || "Sin domiciliario"}</strong>
                      ) : (
                        <Select
                          id={`domi-${order._id}`}
                          value={order.domiciliario?._id || ""}
                          onChange={(e) => changeDomiciliario(order, e.target.value)}
                        >
                          <option value="">Sin asignar</option>
                          {domis.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.username}
                              {d.telefono && ` · ${d.telefono}`}
                            </option>
                          ))}
                        </Select>
                      )}
                      {!terminado && domis.length === 0 && <small>Crea domiciliarios en la pestaña Domiciliarios.</small>}
                    </InfoBlock>
                  </InfoGrid>

                  {!terminado && (
                    <ActionsRow>
                      {siguiente && (
                        <Button onClick={() => changeStatus(order, siguiente.status)} disabled={faltaDomi}>
                          {siguiente.label}
                        </Button>
                      )}
                      <Button $light onClick={() => changeStatus(order, "cancelado")}>
                        Cancelar pedido
                      </Button>
                      {faltaDomi && <Hint>Asigna un domiciliario para enviarlo.</Hint>}
                    </ActionsRow>
                  )}
                </OrderPanel>
              }
            />
          );
        })}
      </List>
    </>
  );
}

// ---------- Productos ----------

const EMPTY_PRODUCT = { tipo: "sabor", name: "", price: "", category: "", description: "", image: "", color: "" };

function ProductosTab() {
  const { reload, categorias } = useProducts();
  const [products, setProducts] = useState([]);
  const [tipo, setTipo] = useState("sabor");
  const [nuevo, setNuevo] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

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

  // Foto del sabor nuevo: se sube apenas la eligen para mostrar la vista previa
  const handleNewImage = async (file) => {
    if (!file) return;
    setSubiendo(true);
    setError("");
    try {
      const { image } = await uploadImageRequest(file);
      setNuevo((n) => ({ ...n, image }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  // Cambiar la foto de un sabor que ya existe
  const handleChangeImage = (product, file) => {
    if (!file) return;
    run(async () => {
      const { image } = await uploadImageRequest(file);
      await updateProductRequest(product._id, { image });
    });
  };

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
                  <Select name="category" value={nuevo.category} onChange={change} style={{ width: "100%" }} required>
                    <option value="">Elige...</option>
                    {categorias.map((c) => <option key={c._id}>{c.name}</option>)}
                  </Select>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Foto</label>
                  <ImagePicker>
                    <Thumb as="label" title="Elegir foto">
                      {nuevo.image ? <img src={imageUrl(nuevo.image)} alt="Vista previa" /> : <span>+</span>}
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleNewImage(e.target.files[0])} hidden />
                    </Thumb>
                    <small>{subiendo ? "Subiendo..." : nuevo.image ? "Toca la foto para cambiarla" : "PNG, JPG o WEBP (máx. 5 MB)"}</small>
                  </ImagePicker>
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
            <Button type="submit" disabled={subiendo}>Agregar</Button>
          </FormGrid>
        </Panel>

        <Panel>
          <h3>{TIPOS.find((t) => t.value === tipo).label}</h3>
          {tipo === "sabor" && (
            <Message style={{ textAlign: "left", padding: "0 0 0.5rem" }}>
              Los sabores marcados con ★ aparecen en el carrusel de la página de inicio.
            </Message>
          )}
          {products
            .filter((p) => p.tipo === tipo)
            .map((p) => (
              <ProductRow key={p._id} $off={!p.disponible}>
                <NameCell>
                  {p.tipo === "sabor" && (
                    <Thumb as="label" title="Cambiar foto" $small>
                      {p.image ? <img src={imageUrl(p.image)} alt={p.name} /> : <span>+</span>}
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleChangeImage(p, e.target.files[0])} hidden />
                    </Thumb>
                  )}
                  <div>
                    <strong>{p.name}</strong>
                    <small>
                      {p.tipo === "sabor" ? (
                        <CategorySelect
                          value={p.category}
                          onChange={(e) => run(() => updateProductRequest(p._id, { category: e.target.value }))}
                          title="Cambiar categoría"
                        >
                          {!categorias.some((c) => c.name === p.category) && <option value={p.category}>{p.category || "Sin categoría"}</option>}
                          {categorias.map((c) => <option key={c._id}>{c.name}</option>)}
                        </CategorySelect>
                      ) : (
                        formatCOP(p.price)
                      )}
                      {p.agotado && " · Agotado"}
                      {!p.disponible && " · Oculto"}
                    </small>
                  </div>
                </NameCell>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={p.price}
                  onBlur={(e) => handlePrice(p, e.target.value)}
                  title="Cambia el precio y haz clic afuera para guardar"
                />
                <RowActions>
                  {p.tipo === "sabor" && (
                    <Button
                      $light={!p.destacado}
                      onClick={() => run(() => updateProductRequest(p._id, { destacado: !p.destacado }))}
                      title="Los sabores destacados aparecen en el carrusel de inicio"
                    >
                      {p.destacado ? "★ Destacado" : "Destacar"}
                    </Button>
                  )}
                  <Button
                    $light={!p.agotado}
                    onClick={() => run(() => updateProductRequest(p._id, { agotado: !p.agotado }))}
                    title={p.agotado ? "Marcar que hay stock" : "Se sigue viendo en el menú pero no se puede pedir"}
                  >
                    {p.agotado ? "Agotado" : "Marcar agotado"}
                  </Button>
                  <Button $light onClick={() => run(() => updateProductRequest(p._id, { disponible: !p.disponible }))}>
                    {p.disponible ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button $light onClick={() => handleDelete(p)}>Eliminar</Button>
                </RowActions>
              </ProductRow>
            ))}
        </Panel>
      </List>
    </>
  );
}

// ---------- Categorías ----------

function CategoriasTab() {
  const { categorias, reload } = useProducts();
  const [nombre, setNombre] = useState("");
  // Nombres editados que todavía no se guardan: { [id]: "nuevo nombre" }
  const [editando, setEditando] = useState({});
  const [error, setError] = useState("");

  const run = async (action) => {
    setError("");
    try {
      await action();
      await reload();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (await run(() => createCategoryRequest(nombre))) setNombre("");
  };

  const handleRename = async (c) => {
    const ok = await run(() => updateCategoryRequest(c._id, editando[c._id]));
    if (ok) setEditando(({ [c._id]: _, ...resto }) => resto);
  };

  const handleDelete = (c) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    run(() => deleteCategoryRequest(c._id));
  };

  return (
    <List>
      {error && <Message>{error}</Message>}

      <Panel>
        <h3>Agregar categoría</h3>
        <FormGrid onSubmit={handleCreate}>
          <div>
            <label>Nombre</label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Temporada, Sin azúcar" required />
          </div>
          <Button type="submit">Agregar</Button>
        </FormGrid>
      </Panel>

      <Panel>
        <h3>Categorías de sabores</h3>
        <Message style={{ textAlign: "left", padding: "0 0 0.5rem" }}>
          Las categorías se usan para filtrar el menú. Solo se puede eliminar una categoría que no tenga sabores.
        </Message>
        {categorias.length === 0 && <Message>No hay categorías todavía.</Message>}
        {categorias.map((c) => {
          const valor = editando[c._id] ?? c.name;
          const cambiado = valor.trim() !== c.name;
          return (
            <ProductRow key={c._id} style={{ gridTemplateColumns: "1fr auto" }}>
              <NameCell>
                <Input
                  value={valor}
                  onChange={(e) => setEditando({ ...editando, [c._id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && cambiado && handleRename(c)}
                  style={{ maxWidth: "260px" }}
                  aria-label={`Nombre de la categoría ${c.name}`}
                />
                <small>{c.sabores} {c.sabores === 1 ? "sabor" : "sabores"}</small>
              </NameCell>
              <RowActions>
                {cambiado && <Button onClick={() => handleRename(c)}>Guardar</Button>}
                <Button $light onClick={() => handleDelete(c)} disabled={c.sabores > 0} title={c.sabores > 0 ? "Tiene sabores" : undefined}>
                  Eliminar
                </Button>
              </RowActions>
            </ProductRow>
          );
        })}
      </Panel>
    </List>
  );
}

// ---------- Domiciliarios ----------

const EMPTY_DOMI = { username: "", email: "", telefono: "", password: "" };

function DomiciliariosTab() {
  const [domis, setDomis] = useState([]);
  const [nuevo, setNuevo] = useState(EMPTY_DOMI);
  const [error, setError] = useState("");

  const load = () => getDomiciliariosRequest().then(setDomis).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createDomiciliarioRequest(nuevo);
      setNuevo(EMPTY_DOMI);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`¿Eliminar la cuenta de "${d.username}"?`)) return;
    setError("");
    try {
      await deleteDomiciliarioRequest(d.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const change = (e) => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  return (
    <List>
      {error && <Message>{error}</Message>}

      <Panel>
        <h3>Agregar domiciliario</h3>
        <FormGrid onSubmit={handleCreate}>
          <div>
            <label>Nombre</label>
            <Input name="username" value={nuevo.username} onChange={change} required />
          </div>
          <div>
            <label>Correo Electrónico</label>
            <Input name="email" type="email" value={nuevo.email} onChange={change} required />
          </div>
          <div>
            <label>Teléfono</label>
            <Input name="telefono" type="tel" value={nuevo.telefono} onChange={change} />
          </div>
          <div>
            <label>Contraseña</label>
            <Input name="password" type="password" minLength={6} placeholder="Mínimo 6 caracteres" value={nuevo.password} onChange={change} required />
          </div>
          <Button type="submit">Crear cuenta</Button>
        </FormGrid>
      </Panel>

      <Panel>
        <h3>Domiciliarios</h3>
        <Message style={{ textAlign: "left", padding: "0 0 0.5rem" }}>
          Los domiciliarios ingresan con su correo y ven los pedidos en estado "preparando" para tomarlos.
        </Message>
        {domis.length === 0 && <Message>No hay domiciliarios todavía.</Message>}
        {domis.map((d) => (
          <ProductRow key={d.id} style={{ gridTemplateColumns: "1fr auto" }}>
            <div>
              <strong>{d.username}</strong>
              <small>{d.email}{d.telefono && ` · Tel: ${d.telefono}`}</small>
            </div>
            <Button $light onClick={() => handleDelete(d)}>Eliminar</Button>
          </ProductRow>
        ))}
      </Panel>
    </List>
  );
}

// ---------- Página ----------

const SECCIONES = [
  { key: "pedidos", label: "Pedidos" },
  { key: "productos", label: "Productos" },
  { key: "categorias", label: "Categorías" },
  { key: "domiciliarios", label: "Domiciliarios" },
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
      {seccion === "categorias" && <CategoriasTab />}
      {seccion === "domiciliarios" && <DomiciliariosTab />}
    </PageWrapper>
  );
}
