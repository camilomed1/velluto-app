import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { imageUrl } from "../../api/api";

const MAX_BOLAS = 3;
const MAX_TOPPINGS = 3;

const PageWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: 600px) {
    padding: 3rem 1rem;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.4rem, 7vw, 3.5rem);
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.title};
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 1.1rem;
`;

const BuilderLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  @media (min-width: 1100px) {
    /* minmax(0, ...) deja que la primera columna se encoja y no empuje el resumen fuera de la pantalla */
    grid-template-columns: minmax(0, 1.2fr) 300px 340px;
    align-items: start;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  background: white;
  padding: 2.5rem;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  opacity: 0;
  transform: translateY(20px);

  @media (max-width: 600px) {
    padding: 1.75rem 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 800;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 30px;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    margin-right: 15px;
  }
`;

const SectionHint = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.9rem;
  margin-bottom: 1.8rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const OptionCard = styled.div`
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.background : "white")};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadow.soft};
  }
  h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text}; }
  .extra { color: ${({ theme }) => theme.colors.primary}; font-weight: bold; font-size: 0.9rem; }
`;

// ---------- Bolas elegidas ----------

const ScoopSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(${MAX_BOLAS}, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.8rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Slot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 52px;
  padding: 0.5rem 0.6rem 0.5rem 0.8rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: ${({ $filled, theme }) => ($filled ? `2px solid ${theme.colors.primary}` : `2px dashed ${theme.colors.border}`)};
  background: ${({ $filled, theme }) => ($filled ? theme.colors.background : "white")};
  color: ${({ $filled, theme }) => ($filled ? theme.colors.text : "#b9aa9b")};
  font-size: 0.9rem;
  font-weight: 600;

  .dot {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ $color }) => $color || "#eee"};
    box-shadow: inset -3px -3px 0 rgba(0, 0, 0, 0.08);
  }

  .name {
    flex: 1;
    line-height: 1.2;
  }

  button {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: white;
    color: ${({ theme }) => theme.colors.dark};
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

// ---------- Cuadrícula de sabores ----------

const CategoryBar = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const CategoryBtn = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : "#eee")};
  background: ${(props) => (props.$active ? props.theme.colors.primary : "white")};
  color: ${(props) => (props.$active ? "white" : props.theme.colors.text)};
  font-weight: 600;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${(props) => (props.$active ? props.theme.colors.primary : "#f8f8f8")};
  }
`;

const FlavorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FlavorTile = styled.button`
  position: relative;
  text-align: left;
  padding: 0;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  border: 2px solid ${({ $count, theme }) => ($count > 0 ? theme.colors.primary : theme.colors.border)};
  font-family: inherit;
  cursor: ${({ $soldOut }) => ($soldOut ? "not-allowed" : "pointer")};
  transition: all 0.25s ease;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    filter: ${({ $soldOut }) => ($soldOut ? "grayscale(0.8)" : "none")};
    opacity: ${({ $soldOut }) => ($soldOut ? 0.6 : 1)};
  }

  .info {
    padding: 0.7rem 0.8rem 0.8rem;
  }

  strong {
    display: block;
    font-size: 0.9rem;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }

  small {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ $soldOut, theme }) => ($soldOut ? theme.colors.dark : theme.colors.primary)};
  }

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.soft};
  }
`;

// Cuántas bolas de este sabor lleva el helado
const CountBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  min-width: 30px;
  height: 30px;
  padding: 0 0.5rem;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const ToppingBtn = styled.button`
  padding: 10px 20px;
  border-radius: 30px;
  font-family: inherit;
  font-weight: 600;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : "white")};
  color: ${({ $active, theme }) => ($active ? "white" : theme.colors.text)};
  cursor: pointer;
  transition: 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// ---------- Vista del helado ----------

const VisualContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 500px;
  background: white;
  border-radius: 40px;
  position: sticky;
  top: 120px;
  overflow: hidden;
  padding-bottom: 50px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1099px) {
    position: static;
    height: 360px;
  }
`;

const EmptyVisual = styled.p`
  margin: auto;
  padding: 0 2rem;
  text-align: center;
  color: #b9aa9b;
  font-weight: 600;
`;

const ScoopVisual = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ $color }) => $color || "#f0f0f0"};
  margin-bottom: -55px;
  z-index: ${({ $index }) => 10 - $index};
  box-shadow: inset -12px -12px 0 rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.05);
  border: 2px solid rgba(255,255,255,0.5);
`;

const BaseVisual = styled.div`
  z-index: 1;
  ${({ $type }) => $type === "Cono" && `width: 90px; height: 130px; background: #e3a661; clip-path: polygon(0 0, 100% 0, 50% 100%); background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px);`}
  ${({ $type }) => $type === "Vaso" && `width: 120px; height: 95px; background: repeating-linear-gradient(90deg, #E8D3B5 0 12px, #D9C2A3 12px 24px); clip-path: polygon(0 0, 100% 0, 84% 100%, 16% 100%); border-top: 8px solid #C97E5A;`}
  ${({ $type }) => ($type === "Brownie" || $type === "Waffle Bowl") && `width: 140px; height: 50px; background: #3d2b1f; border-radius: 12px;`}
`;

// ---------- Resumen ----------

const SummaryCard = styled.div`
  position: sticky;
  top: 120px;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  border-radius: 35px;
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(122, 90, 70, 0.3);

  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
  }

  @media (max-width: 1099px) {
    position: static;
  }
`;

const SummaryItem = styled.div`
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  padding-bottom: 1rem;
  span { display: block; opacity: 0.7; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.2rem; }
  strong { font-size: 1rem; line-height: 1.4; }
`;

const Total = styled.div`
  margin-top: 1.5rem;
  span { opacity: 0.7; font-size: 0.85rem; }
  h3 { font-size: 2.1rem; color: white; margin-top: 0.3rem; font-family: ${({ theme }) => theme.fonts.title}; }
`;

const OrderButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 1.1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: white;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 800;
  font-family: inherit;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { transform: scale(1.02); }
`;

const CheckoutButton = styled(OrderButton)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  margin-top: 0.5rem;
  &:hover { background: #b56e4c; }
`;

const ClearCartButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.75);
  padding: 0.8rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8rem;
  font-weight: bold;
  font-family: inherit;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: white;
  }
`;

const ToastContainer = styled.div` position: fixed; top: 10%; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; `;
const ToastBody = styled.div`
  background: ${({ $type, theme }) => ($type === "error" ? theme.colors.primary : theme.colors.success)};
  color: white;
  padding: 1rem 2rem;
  border-radius: 15px;
  opacity: 0;
  font-weight: bold;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

const EMPTY_ORDER = { base: "", flavors: [], toppings: [] };

export function Ordenar({ cart, setCart }) {
  const [order, setOrder] = useState(EMPTY_ORDER);
  const [categoria, setCategoria] = useState("Todos");
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const navigate = useNavigate();
  const location = useLocation();
  const { sabores, bases, toppings, categorias } = useProducts();
  const { user, canOrder } = useAuth();

  useGSAP(() => {
    gsap.to(".reveal-section", { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power4.out" });
  }, []);

  useGSAP(() => {
    gsap.fromTo(".scoop-anim",
      { y: -300, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "bounce.out" }
    );
  }, [order.flavors]);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    const tl = gsap.timeline();
    tl.fromTo(".toast-inner", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)", overwrite: "all" })
      .to(".toast-inner", { y: -20, opacity: 0, duration: 0.4, delay: 2.5, ease: "power2.in" });
  };

  const saborById = (id) => sabores.find((s) => s._id === id);

  // Si viene de la página Sabores, empezamos con ese sabor como primera bola
  useEffect(() => {
    const id = location.state?.sabor;
    if (!id || sabores.length === 0) return;
    const s = saborById(id);
    if (s && !s.agotado) {
      setOrder((o) => (o.flavors.length === 0 ? { ...o, flavors: [id] } : o));
      showToast(`${s.name} agregado. Ahora elige tu base`);
    }
    // Limpiamos el estado para que no se vuelva a agregar al recargar
    navigate(location.pathname, { replace: true, state: null });
  }, [sabores, location.state]);

  // Cada toque en un sabor agrega una bola (se puede repetir el mismo sabor)
  const addFlavor = (s) => {
    if (s.agotado) return showToast(`${s.name} está agotado`, "error");
    if (order.flavors.length >= MAX_BOLAS) return showToast(`Máximo ${MAX_BOLAS} bolas por helado`, "error");
    setOrder({ ...order, flavors: [...order.flavors, s._id] });
  };

  const removeFlavor = (index) => setOrder({ ...order, flavors: order.flavors.filter((_, i) => i !== index) });

  const toggleTopping = (t) => {
    const exists = order.toppings.find((item) => item._id === t._id);
    if (!exists && order.toppings.length >= MAX_TOPPINGS) return showToast(`Máximo ${MAX_TOPPINGS} toppings por helado`, "error");
    setOrder({ ...order, toppings: exists ? order.toppings.filter((it) => it._id !== t._id) : [...order.toppings, t] });
  };

  const calculateTotal = () => {
    const baseP = bases.find((b) => b.name === order.base)?.price || 0;
    const flavorsP = order.flavors.reduce((acc, id) => acc + (saborById(id)?.price || 0), 0);
    const toppingsP = order.toppings.reduce((acc, t) => acc + t.price, 0);
    return baseP + flavorsP + toppingsP;
  };

  const handleAddToCart = () => {
    if (!order.base) return showToast("Elige una base 🍦", "error");
    if (order.flavors.length === 0) return showToast("Elige al menos un sabor ✨", "error");
    const flavorNames = order.flavors.map((id) => saborById(id).name);
    const baseId = bases.find((b) => b.name === order.base)._id;
    // Guardamos los nombres para mostrarlos y los IDs para enviarlos al backend
    setCart([...cart, { ...order, scoops: order.flavors.length, flavors: flavorNames, flavorIds: order.flavors, baseId, finalPrice: calculateTotal() }]);
    showToast("¡Agregado a Velluto! 😋");
    setOrder(EMPTY_ORDER);
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Carrito vaciado 🗑️", "error");
  };

  // Solo mostramos las categorías que tienen sabores
  const categoriasConSabores = categorias.filter((c) => sabores.some((s) => s.category === c.name));
  const saboresVisibles = categoria === "Todos" ? sabores : sabores.filter((s) => s.category === categoria);
  const contar = (id) => order.flavors.filter((f) => f === id).length;

  // Administradores y domiciliarios no pueden hacer pedidos (el backend también lo bloquea)
  if (!canOrder) {
    return (
      <PageWrapper>
        <Title>Pedidos solo para clientes</Title>
        <Subtitle>Las cuentas de administrador y domiciliario no pueden hacer pedidos. Para pedir, cierra sesión o entra con una cuenta de cliente.</Subtitle>
        <CheckoutButton style={{ maxWidth: 320, display: "block", margin: "2rem auto 0" }} onClick={() => navigate(user.rol === "admin" ? "/admin" : "/entregas")}>
          Ir a mi panel
        </CheckoutButton>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ToastContainer>
        <ToastBody className="toast-inner" $type={notification.type}>
          {notification.message}
        </ToastBody>
      </ToastContainer>

      <Title>Diseña tu Gelato</Title>
      <Subtitle>El arte del sabor en tus manos</Subtitle>

      <BuilderLayout>
        <div>
          <Section className="reveal-section">
            <SectionTitle>01. Base</SectionTitle>
            <SectionHint>¿Dónde quieres tu helado?</SectionHint>
            <OptionsGrid>
              {bases.map((b) => (
                <OptionCard
                  key={b._id}
                  $active={order.base === b.name}
                  style={b.agotado ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                  onClick={() => (b.agotado ? showToast(`${b.name} está agotado`, "error") : setOrder({ ...order, base: b.name }))}
                >
                  <h3>{b.name}</h3>
                  <span className="extra">{b.agotado ? "Agotado" : `+${formatCOP(b.price)}`}</span>
                </OptionCard>
              ))}
            </OptionsGrid>
          </Section>

          <Section className="reveal-section">
            <SectionTitle>02. Sabores ({order.flavors.length}/{MAX_BOLAS})</SectionTitle>
            <SectionHint>Toca un sabor para agregar una bola. Puedes repetir tu favorito.</SectionHint>

            <ScoopSlots>
              {Array.from({ length: MAX_BOLAS }).map((_, i) => {
                const s = saborById(order.flavors[i]);
                return (
                  <Slot key={i} $filled={!!s} $color={s?.color}>
                    <span className="dot" />
                    <span className="name">{s ? s.name : `Bola ${i + 1}`}</span>
                    {s && (
                      <button type="button" onClick={() => removeFlavor(i)} aria-label={`Quitar ${s.name}`}>
                        ×
                      </button>
                    )}
                  </Slot>
                );
              })}
            </ScoopSlots>

            {categoriasConSabores.length > 1 && (
              <CategoryBar>
                {["Todos", ...categoriasConSabores.map((c) => c.name)].map((c) => (
                  <CategoryBtn key={c} type="button" $active={categoria === c} onClick={() => setCategoria(c)}>
                    {c}
                  </CategoryBtn>
                ))}
              </CategoryBar>
            )}

            <FlavorGrid>
              {saboresVisibles.map((s) => {
                const count = contar(s._id);
                return (
                  <FlavorTile key={s._id} type="button" $count={count} $soldOut={s.agotado} onClick={() => addFlavor(s)} aria-label={`Agregar ${s.name}`}>
                    {count > 0 && <CountBadge>×{count}</CountBadge>}
                    <img src={imageUrl(s.image)} alt="" loading="lazy" />
                    <div className="info">
                      <strong>{s.name}</strong>
                      <small>{s.agotado ? "Agotado" : `+${formatCOP(s.price)}`}</small>
                    </div>
                  </FlavorTile>
                );
              })}
            </FlavorGrid>
          </Section>

          <Section className="reveal-section">
            <SectionTitle>03. Toppings ({order.toppings.length}/{MAX_TOPPINGS})</SectionTitle>
            <SectionHint>Opcional. Elige hasta {MAX_TOPPINGS}.</SectionHint>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {toppings.map((t) => (
                <ToppingBtn
                  key={t._id}
                  type="button"
                  disabled={t.agotado}
                  $active={order.toppings.some((item) => item._id === t._id)}
                  onClick={() => toggleTopping(t)}
                >
                  {t.name}{t.agotado ? " (Agotado)" : ` +${formatCOP(t.price)}`}
                </ToppingBtn>
              ))}
            </div>
          </Section>
        </div>

        <VisualContainer className="reveal-section">
          {!order.base && order.flavors.length === 0 && <EmptyVisual>Tu helado aparecerá aquí</EmptyVisual>}
          {order.flavors.map((flavorId, index) => (
            <ScoopVisual key={`${flavorId}-${index}`} className="scoop-anim"
              $color={saborById(flavorId)?.color}
              $index={index}
            />
          )).reverse()}
          <BaseVisual $type={order.base} />
        </VisualContainer>

        <SummaryCard className="reveal-section">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Tu Pedido</h2>
          <SummaryItem><span>Base</span><strong>{order.base || "No seleccionada"}</strong></SummaryItem>
          <SummaryItem>
            <span>Sabores</span>
            <strong>{order.flavors.length > 0 ? order.flavors.map((id) => saborById(id)?.name).join(" • ") : "Ninguno todavía"}</strong>
          </SummaryItem>
          <SummaryItem>
            <span>Toppings</span>
            <strong>{order.toppings.length > 0 ? order.toppings.map((t) => t.name).join(", ") : "Sin toppings"}</strong>
          </SummaryItem>
          <Total>
            <span>Subtotal helado</span>
            <h3>{formatCOP(calculateTotal())}</h3>
          </Total>

          <OrderButton onClick={handleAddToCart}>Agregar al Carrito</OrderButton>

          {cart.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.8rem' }}>
              <CheckoutButton onClick={() => navigate("/domicilio")}>
                Pagar {cart.length} {cart.length === 1 ? 'helado' : 'helados'} ({formatCOP(cart.reduce((acc, item) => acc + item.finalPrice, 0))})
              </CheckoutButton>
              <ClearCartButton onClick={handleClearCart}>
                Limpiar Carrito
              </ClearCartButton>
            </div>
          )}
        </SummaryCard>
      </BuilderLayout>
    </PageWrapper>
  );
}
