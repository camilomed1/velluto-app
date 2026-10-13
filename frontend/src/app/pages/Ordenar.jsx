import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SABORES, BASES, TOPPINGS } from "../../data/sabores";



const PageWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background-color: #fdfbf9;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.title};
  color: #2c3e50;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 4rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const BuilderLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  @media (min-width: 1100px) {
    grid-template-columns: 1.2fr 320px 380px;
    align-items: start;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  background: white;
  padding: 2.5rem;
  border-radius: 32px;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  opacity: 0;
  transform: translateY(20px);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const OptionCard = styled.div`
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : "#f1f2f6")};
  background: ${({ $active }) => ($active ? "#fffcf9" : "white")};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.05);
  }
  h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: #34495e; }
  .extra { color: ${({ theme }) => theme.colors.primary}; font-weight: bold; font-size: 0.9rem; }
`;

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
  border: 1px solid rgba(0,0,0,0.05);
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
  ${({ $type }) => $type === "Vaso" && `width: 120px; height: 80px; background: #fff; border: 4px solid #f1f2f6; border-radius: 5px 5px 40px 40px;`}
  ${({ $type }) => ($type === "Brownie" || $type === "Waffle Bowl") && `width: 140px; height: 50px; background: #3d2b1f; border-radius: 12px;`}
`;

const SummaryCard = styled.div`
  position: sticky;
  top: 120px;
  background: #2c3e50;
  color: white;
  border-radius: 35px;
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(44, 62, 80, 0.3);
`;

const SummaryItem = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1rem;
  span { display: block; opacity: 0.6; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
  strong { font-size: 1rem; color: #ecf0f1; }
`;

const Total = styled.div`
  margin-top: 2rem;
  h3 { font-size: 2.1rem; color: white; margin-top: 0.5rem; font-family: 'Courier New', monospace; }
`;

const OrderButton = styled.button` 
  width: 100%; 
  margin-top: 1.5rem; 
  padding: 1.2rem; 
  border: none; 
  border-radius: 20px; 
  background: white; 
  color: #2c3e50; 
  font-weight: 800; 
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { transform: scale(1.02); }
`;

const CheckoutButton = styled(OrderButton)`
  background: #2ecc71;
  color: white;
  margin-top: 0.5rem; 
  &:hover { background: #27ae60; }
`;

const ClearCartButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    border-color: #e74c3c;
  }
`;

const ToastContainer = styled.div` position: fixed; top: 10%; left: 50%; transform: translateX(-50%); z-index: 9999; pointer-events: none; `;
const ToastBody = styled.div` background: ${({ $type }) => ($type === "error" ? "#e74c3c" : "#2ecc71")}; color: white; padding: 1rem 2rem; border-radius: 15px; opacity: 0; font-weight: bold; `;



const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

export function Ordenar({ cart, setCart }) {
  const [order, setOrder] = useState({ base: "", scoops: 1, flavors: [""], toppings: [] });
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

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

  const calculateTotal = () => {
    const baseP = BASES.find(b => b.name === order.base)?.price || 0;
    const flavorsP = order.flavors.reduce((acc, id) => acc + (SABORES.find(s => s.id === id)?.price || 0), 0);
    const toppingsP = order.toppings.reduce((acc, t) => acc + t.price, 0);
    return baseP + flavorsP + toppingsP;
  };

  const handleAddToCart = () => {
    if (!order.base) return showToast("Elige una base 🍦", "error");
    if (order.flavors.some(f => f === "")) return showToast("Completa tus sabores ✨", "error");
    const flavorNames = order.flavors.map(id => SABORES.find(s => s.id === id).name);
    setCart([...cart, { ...order, flavors: flavorNames, finalPrice: calculateTotal() }]);
    showToast("¡Agregado a Velluto! 😋");
    setOrder({ base: "", scoops: 1, flavors: [""], toppings: [] });
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Carrito vaciado 🗑️", "error");
  };

  return (
    <PageWrapper>
      <ToastContainer>
        <ToastBody className="toast-inner" $type={notification.type}>
          {notification.type === "success" ? "✅" : "⚠️"} {notification.message}
        </ToastBody>
      </ToastContainer>

      <Title>Diseña tu Gelato</Title>
      <Subtitle>El arte del sabor en tus manos</Subtitle>

      <BuilderLayout>
        <div>
          <Section className="reveal-section">
            <SectionTitle>01. Base</SectionTitle>
            <OptionsGrid>
              {BASES.map(b => (
                <OptionCard key={b.id} $active={order.base === b.name} onClick={() => setOrder({ ...order, base: b.name })}>
                  <h3>{b.name}</h3>
                  <span className="extra">+{formatCOP(b.price)}</span>
                </OptionCard>
              ))}
            </OptionsGrid>
            <div style={{ marginTop: '2.5rem' }}>
              <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Bolas de helado:</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                {[1, 2, 3].map(n => (
                  <button key={n} onClick={() => setOrder({ ...order, scoops: n, flavors: Array(n).fill("") })}
                    style={{ padding: '15px 25px', borderRadius: '15px', border: 'none', cursor: 'pointer',
                    background: order.scoops === n ? '#2c3e50' : '#f1f2f6', color: order.scoops === n ? 'white' : '#2c3e50', fontWeight: 'bold' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section className="reveal-section">
            <SectionTitle>02. Sabores</SectionTitle>
            {order.flavors.map((fid, i) => (
              <select key={i} value={fid} onChange={(e) => {
                const upd = [...order.flavors];
                upd[i] = e.target.value;
                setOrder({...order, flavors: upd});
              }} style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', marginBottom: '1rem', border: '2px solid #f1f2f6', outline: 'none' }}>
                <option value="">Selecciona sabor #{i + 1}...</option>
                {SABORES.map(s => <option key={s.id} value={s.id}>{s.name} (+{formatCOP(s.price)})</option>)}
              </select>
            ))}
          </Section>

          <Section className="reveal-section">
            <SectionTitle>03. Toppings</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {TOPPINGS.map(t => (
                <button key={t.id} onClick={() => {
                  const exists = order.toppings.find(item => item.id === t.id);
                  setOrder({...order, toppings: exists ? order.toppings.filter(it => it.id !== t.id) : [...order.toppings, t]});
                }} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #eee', cursor: 'pointer',
                background: order.toppings.some(item => item.id === t.id) ? '#e67e22' : 'white', 
                color: order.toppings.some(item => item.id === t.id) ? 'white' : '#2c3e50' }}>
                  {t.name}
                </button>
              ))}
            </div>
          </Section>
        </div>

        <VisualContainer className="reveal-section">
          {order.flavors.map((flavorId, index) => (
            flavorId && (
              <ScoopVisual key={`${flavorId}-${index}`} className="scoop-anim" 
                $color={SABORES.find(s => s.id === flavorId)?.color} 
                $index={index} 
              />
            )
          )).reverse()}
          <BaseVisual $type={order.base} />
        </VisualContainer>

        <SummaryCard className="reveal-section">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Tu Pedido</h2>
          <SummaryItem><span>Soporte</span><strong>{order.base || "No seleccionado"}</strong></SummaryItem>
          <SummaryItem><span>Toppings</span><strong>{order.toppings.length} añadidos</strong></SummaryItem>
          <Total>
            <span>Subtotal Helado</span>
            <h3>{formatCOP(calculateTotal())}</h3>
          </Total>
          
          <OrderButton onClick={handleAddToCart}>Agregar al Carrito</OrderButton>

          {cart.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
              <CheckoutButton onClick={() => navigate("/recibo")}>
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