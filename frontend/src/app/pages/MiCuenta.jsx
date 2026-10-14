import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  updateProfileRequest,
  changePasswordRequest,
  addAddressRequest,
  updateAddressRequest,
  deleteAddressRequest,
  getMyOrdersRequest,
} from "../../api/api";
import { OrderCard } from "../components/OrderCard";

// ---------- Estilos (mismos colores y formas del resto de la página) ----------

const PageWrapper = styled.div`
  max-width: 900px;
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
  font-size: clamp(2.2rem, 6vw, 3rem);
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
  font-family: inherit;
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

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: end;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.9rem;
    background: white;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.dark};
    }
  }
`;

const Full = styled.div`
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 0.9rem 1.6rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: 0.3s ease;
  border: 1px solid ${({ theme, $light }) => ($light ? theme.colors.border : theme.colors.primary)};
  background: ${({ theme, $light }) => ($light ? "white" : theme.colors.primary)};
  color: ${({ theme, $light }) => ($light ? theme.colors.text : "white")};

  &:hover {
    background: ${({ theme, $light }) => ($light ? theme.colors.background : theme.colors.dark)};
    border-color: ${({ theme, $light }) => ($light ? theme.colors.primary : theme.colors.dark)};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const AddressCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    display: block;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.5;
  }
`;

const Badge = styled.span`
  display: inline-block !important;
  margin-left: 0.5rem;
  padding: 0.15rem 0.7rem;
  border-radius: 25px;
  font-size: 0.7rem !important;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.primary};
  color: white !important;
`;

const Empty = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.dark};

  button {
    margin-top: 1.5rem;
  }
`;

// ---------- Mis datos ----------

function DatosTab() {
  const { user, setUser } = useAuth();
  const [datos, setDatos] = useState({ username: user.username, telefono: user.telefono || "" });
  const [datosMsg, setDatosMsg] = useState("");
  const [pwd, setPwd] = useState({ passwordActual: "", passwordNueva: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  const guardarDatos = async (e) => {
    e.preventDefault();
    setDatosMsg("");
    try {
      setUser(await updateProfileRequest(datos));
      setDatosMsg("Datos guardados");
    } catch (err) {
      setDatosMsg(err.message);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    try {
      const res = await changePasswordRequest(pwd);
      setPwd({ passwordActual: "", passwordNueva: "" });
      setPwdMsg(res.message);
    } catch (err) {
      setPwdMsg(err.message);
    }
  };

  return (
    <List>
      <Panel>
        <h3>Datos personales</h3>
        <FormGrid onSubmit={guardarDatos}>
          <Field>
            <label>Nombre</label>
            <input value={datos.username} onChange={(e) => setDatos({ ...datos, username: e.target.value })} required />
          </Field>
          <Field>
            <label>Teléfono</label>
            <input type="tel" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
          </Field>
          <Field>
            <label>Correo Electrónico</label>
            <input value={user.email} disabled />
          </Field>
          <div>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </FormGrid>
        {datosMsg && <Message>{datosMsg}</Message>}
      </Panel>

      <Panel>
        <h3>Cambiar contraseña</h3>
        <FormGrid onSubmit={cambiarPassword}>
          <Field>
            <label>Contraseña actual</label>
            <input type="password" value={pwd.passwordActual} onChange={(e) => setPwd({ ...pwd, passwordActual: e.target.value })} required />
          </Field>
          <Field>
            <label>Contraseña nueva</label>
            <input type="password" minLength={6} placeholder="Mínimo 6 caracteres" value={pwd.passwordNueva} onChange={(e) => setPwd({ ...pwd, passwordNueva: e.target.value })} required />
          </Field>
          <div>
            <Button type="submit">Cambiar contraseña</Button>
          </div>
        </FormGrid>
        {pwdMsg && <Message>{pwdMsg}</Message>}
      </Panel>
    </List>
  );
}

// ---------- Mis direcciones ----------

const EMPTY_ADDRESS = { alias: "", direccion: "", comentario: "" };

function DireccionesTab() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(EMPTY_ADDRESS);
  // null = agregando una nueva; un _id = editando esa dirección
  const [editando, setEditando] = useState(null);
  const [msg, setMsg] = useState("");

  const run = async (action) => {
    setMsg("");
    try {
      setUser(await action());
      return true;
    } catch (err) {
      setMsg(err.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await run(() => (editando ? updateAddressRequest(editando, form) : addAddressRequest(form)));
    if (ok) {
      setForm(EMPTY_ADDRESS);
      setEditando(null);
    }
  };

  const editar = (d) => {
    setEditando(d._id);
    setForm({ alias: d.alias, direccion: d.direccion, comentario: d.comentario || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelar = () => {
    setEditando(null);
    setForm(EMPTY_ADDRESS);
  };

  const eliminar = (d) => {
    if (!window.confirm(`¿Eliminar la dirección "${d.alias}"?`)) return;
    if (editando === d._id) cancelar();
    run(() => deleteAddressRequest(d._id));
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <List>
      <Panel>
        <h3>{editando ? "Editar dirección" : "Agregar dirección"}</h3>
        <FormGrid onSubmit={handleSubmit}>
          <Field>
            <label>Nombre</label>
            <input name="alias" value={form.alias} onChange={change} placeholder="Ej: Casa, Trabajo" required />
          </Field>
          <Field>
            <label>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={change} placeholder="Ej: Calle 10 # 5-20" required />
          </Field>
          <Full>
            <Field>
              <label>Comentario</label>
              <input name="comentario" value={form.comentario} onChange={change} placeholder="Ej: Apto 302, timbre dañado" />
            </Field>
          </Full>
          <Actions>
            <Button type="submit">{editando ? "Guardar cambios" : "Agregar"}</Button>
            {editando && <Button type="button" $light onClick={cancelar}>Cancelar</Button>}
          </Actions>
        </FormGrid>
        {msg && <Message>{msg}</Message>}
      </Panel>

      <Panel>
        <h3>Mis direcciones</h3>
        {user.direcciones.length === 0 && (
          <p style={{ color: "inherit", opacity: 0.7 }}>Todavía no tienes direcciones guardadas.</p>
        )}
        {user.direcciones.map((d) => (
          <AddressCard key={d._id}>
            <div>
              <strong>
                {d.alias}
                {d.principal && <Badge>Principal</Badge>}
              </strong>
              <span>{d.direccion}</span>
              {d.comentario && <span>{d.comentario}</span>}
            </div>
            <Actions>
              {!d.principal && (
                <Button $light onClick={() => run(() => updateAddressRequest(d._id, { principal: true }))}>
                  Hacer principal
                </Button>
              )}
              <Button $light onClick={() => editar(d)}>Editar</Button>
              <Button $light onClick={() => eliminar(d)}>Eliminar</Button>
            </Actions>
          </AddressCard>
        ))}
      </Panel>
    </List>
  );
}

// ---------- Mis pedidos ----------

function PedidosTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrdersRequest()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Empty>Cargando tus pedidos...</Empty>;
  if (error) return <Empty>{error}</Empty>;

  if (orders.length === 0) {
    return (
      <Empty>
        <p>Todavía no has hecho ningún pedido con tu cuenta.</p>
        <Button onClick={() => navigate("/ordenar")}>Armar mi helado</Button>
      </Empty>
    );
  }

  return (
    <List>
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </List>
  );
}

// ---------- Página ----------

const SECCIONES = [
  { key: "datos", label: "Mis datos" },
  { key: "direcciones", label: "Mis direcciones" },
  { key: "pedidos", label: "Mis pedidos" },
];

export function MiCuenta() {
  const { user } = useAuth();
  // La pestaña va en la URL (?tab=direcciones) para poder enlazarla directo
  const [params, setParams] = useSearchParams();
  const seccion = SECCIONES.some((s) => s.key === params.get("tab")) ? params.get("tab") : "datos";

  return (
    <PageWrapper>
      <Eyebrow>Hola, {user.username}</Eyebrow>
      <Title>Mi cuenta</Title>

      <Tabs>
        {SECCIONES.map((s) => (
          <TabBtn key={s.key} $active={seccion === s.key} onClick={() => setParams({ tab: s.key })}>
            {s.label}
          </TabBtn>
        ))}
      </Tabs>

      {seccion === "datos" && <DatosTab />}
      {seccion === "direcciones" && <DireccionesTab />}
      {seccion === "pedidos" && <PedidosTab />}
    </PageWrapper>
  );
}
