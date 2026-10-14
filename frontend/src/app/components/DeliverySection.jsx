import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addAddressRequest, createOrderRequest } from "../../api/api";



const DeliverySectionWrapper = styled.section`
  background: white;
  padding: 6rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 0 1.5rem;
  }
`;


const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 6vw, 3rem);
  line-height: 1.1;
  font-family: ${({ theme }) => theme.fonts.title};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.7;
`;

const Benefit = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  border: 2px solid black;
  padding: 1.5rem;
  background-color: white;
  text-align: center; 
  
  h3 {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #000;
  }
  
  p {
    font-size: 0.9rem;
    color: #4b5563;
    margin: 0;
  }
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input, textarea {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.9rem;
    background: white;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  border: none;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
  }
`;
const CartSummary = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const FormMessage = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const AccountHint = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.dark};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const AddressOption = styled.button`
  text-align: left;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: white;
  font-family: inherit;
  cursor: pointer;
  transition: 0.2s ease;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    display: block;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.dark};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckRow = styled.label`
  display: flex !important;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500 !important;
  cursor: pointer;

  input {
    width: auto !important;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;
// --- Componente ---

const formatCOP = (val) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

const OTRA = "otra";

export function DeliverySection({ cart = [], setCart }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const direcciones = user?.direcciones || [];

  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "", comentario: "" });
  // Dirección guardada elegida (su _id) u "otra" para escribir una nueva
  const [seleccion, setSeleccion] = useState(OTRA);
  const [guardar, setGuardar] = useState({ activo: false, alias: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  const elegirDireccion = (dir) => {
    setSeleccion(dir._id);
    setForm((f) => ({ ...f, direccion: dir.direccion, comentario: dir.comentario || "" }));
  };

  const elegirOtra = () => {
    setSeleccion(OTRA);
    setForm((f) => ({ ...f, direccion: "", comentario: "" }));
  };

  // Si hay sesión llenamos los datos de la cuenta y elegimos la dirección principal
  useEffect(() => {
    if (!user) return;
    const principal = user.direcciones?.find((d) => d.principal) || user.direcciones?.[0];
    setForm((f) => ({
      ...f,
      nombre: f.nombre || user.username,
      telefono: f.telefono || user.telefono || "",
    }));
    if (principal) elegirDireccion(principal);
  }, [user?.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return navigate("/ordenar");

    setSending(true);
    setError("");
    try {
      const order = await createOrderRequest({
        items: cart.map((item) => ({
          base: item.baseId,
          flavors: item.flavorIds,
          toppings: item.toppings.map((t) => t._id),
        })),
        delivery: form,
      });

      // Guardar la dirección nueva en la cuenta si el usuario lo pidió
      if (user && seleccion === OTRA && guardar.activo) {
        const updated = await addAddressRequest({
          alias: guardar.alias.trim() || "Mi dirección",
          direccion: form.direccion,
          comentario: form.comentario,
        }).catch(() => null);
        if (updated) setUser(updated);
      }

      setCart([]);
      navigate("/recibo", { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const vacio = cart.length === 0;

  return (
    <DeliverySectionWrapper>
      <Container>

        <LeftContent>
          <Eyebrow>Domicilio</Eyebrow>

          <Title>
            Tu helado favorito, directo a casa
          </Title>

          <Text>
            Entregamos rápido para que disfrutes cada sabor con la textura perfecta.
          </Text>

          <Benefit>✓ Menos de 30 minutos</Benefit>
          <Benefit>✓ Cobertura en toda la ciudad</Benefit>
          <Benefit>✓ Atención todos los días</Benefit>
        </LeftContent>

        <FormContainer>
          <h3>Solicita tu pedido</h3>

          <CartSummary>
            {!vacio
              ? `Tu carrito: ${cart.length} ${cart.length === 1 ? "helado" : "helados"} (${formatCOP(subtotal)})`
              : "Tu carrito está vacío. Arma tu helado primero."}
          </CartSummary>

          {!user && !vacio && (
            <AccountHint>
              ¿Tienes cuenta? <Link to="/login" state={{ from: "/domicilio" }}>Ingresa</Link> para usar tus direcciones guardadas.
            </AccountHint>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required={!vacio} />
            </FormGroup>

            <FormGroup>
              <label>Teléfono</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} required={!vacio} />
            </FormGroup>

            {direcciones.length > 0 && (
              <FormGroup>
                <label>Dirección de entrega</label>
                <AddressList>
                  {direcciones.map((d) => (
                    <AddressOption type="button" key={d._id} $active={seleccion === d._id} onClick={() => elegirDireccion(d)}>
                      <strong>{d.alias}{d.principal ? " · Principal" : ""}</strong>
                      <span>{d.direccion}</span>
                    </AddressOption>
                  ))}
                  <AddressOption type="button" $active={seleccion === OTRA} onClick={elegirOtra}>
                    <strong>Otra dirección</strong>
                    <span>Escribir una dirección nueva</span>
                  </AddressOption>
                </AddressList>
              </FormGroup>
            )}

            {seleccion === OTRA && (
              <FormGroup>
                <label>Dirección</label>
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required={!vacio} />
              </FormGroup>
            )}

            <FormGroup>
              <label>Comentario</label>
              <textarea rows="3" name="comentario" value={form.comentario} onChange={handleChange} placeholder="Ej: Apto 302, timbre dañado..." />
            </FormGroup>

            {user && seleccion === OTRA && !vacio && (
              <FormGroup>
                <CheckRow>
                  <input type="checkbox" checked={guardar.activo} onChange={(e) => setGuardar({ ...guardar, activo: e.target.checked })} />
                  Guardar esta dirección en mi cuenta
                </CheckRow>
                {guardar.activo && (
                  <input
                    type="text"
                    value={guardar.alias}
                    onChange={(e) => setGuardar({ ...guardar, alias: e.target.value })}
                    placeholder="Nombre de la dirección (ej: Casa, Trabajo)"
                    style={{ marginTop: "0.6rem" }}
                  />
                )}
              </FormGroup>
            )}

            <SubmitButton type="submit" disabled={sending}>
              {sending ? "Enviando..." : vacio ? "Ir a Ordenar" : "Pedir ahora"}
            </SubmitButton>
          </form>

          {error && <FormMessage>{error}</FormMessage>}
        </FormContainer>

      </Container>
    </DeliverySectionWrapper>
  );
}
