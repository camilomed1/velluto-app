import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";

const PrintStyles = createGlobalStyle`
  @media print {
   
    header, nav, footer, .no-print, [class*="Chat"], button, aside {
      display: none !important;
    }

   
    body { 
      background: white !important; 
      margin: 0 !important; 
      padding: 0 !important; 
      -webkit-print-color-adjust: exact;
    }

   
    #print-section {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 1.5cm;
      box-shadow: none !important;
      border: none !important;
    }

    @page {
      margin: 0;
      size: auto;
    }
  }
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f8f5f2; 
  padding: 4rem 2rem;
`;

const ReceiptContainer = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 4rem 3.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  position: relative;
  font-family: 'Inter', sans-serif;
  border: 1px solid rgba(0,0,0,0.05);

 
  &::before, &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 10px;
    background-size: 20px 10px;
  }
  &::before {
    top: -10px;
    background-image: radial-gradient(circle at 10px -5px, transparent 12px, white 13px);
  }
`;

const LogoHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 { 
    font-family: ${({ theme }) => theme.fonts.title}; 
    font-size: 3rem; 
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 0.75rem;
    color: #a0a0a0;
    font-weight: 700;
  }
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 1.2rem 0;
  margin-bottom: 2.5rem;
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
`;

const ItemsList = styled.div`
  margin-bottom: 3rem;
`;

const ReceiptItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  .main-info {
    strong { display: block; font-size: 1.1rem; color: #2c3e50; margin-bottom: 0.4rem; }
    span { display: block; font-size: 0.85rem; color: #7f8c8d; line-height: 1.5; }
  }
  .price {
    font-weight: 700;
    color: #2c3e50;
    font-size: 1rem;
  }
`;

const Divider = styled.div`
  border-top: 1px dashed #ddd;
  margin: 1.5rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: ${({ $isTotal }) => $isTotal ? '#2c3e50' : '#7f8c8d'};
  font-weight: ${({ $isTotal }) => $isTotal ? '900' : '400'};
  ${({ $isTotal }) => $isTotal && 'font-size: 1.5rem; margin-top: 1rem;'}
`;

const Stamp = styled.div`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3rem auto 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  text-align: center;
  transform: rotate(-15deg);
  opacity: 0.6;
`;

const Actions = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media print { display: none !important; }
`;

const Button = styled.button`
  padding: 1.2rem;
  border: none;
  border-radius: 100px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
  background: ${({ $primary, theme }) => $primary ? theme.colors.primary : "#f4f1ee"};
  color: ${({ $primary }) => $primary ? "white" : "#2c3e50"};
  
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
`;

export function Recibo({ cart, setCart }) {
  const navigate = useNavigate();
  const ENVIO = 5000;
  const subtotal = cart.reduce((acc, item) => acc + item.finalPrice, 0);
  const totalGeneral = subtotal + ENVIO;

  const handleFinish = () => {
    setCart([]);
    navigate("/");
  };

  if (cart.length === 0) return null;

  return (
    <>
      <PrintStyles />
      <PageWrapper>
        <ReceiptContainer id="print-section">
          <LogoHeader>
            <h2>Velluto</h2>
            <div className="subtitle">Gelatería Artesanal</div>
          </LogoHeader>

          <InfoBar>
            <div>NEIVA, HUILA</div>
            <div>{new Date().toLocaleDateString()} | {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </InfoBar>

          <ItemsList>
            {cart.map((item, idx) => (
              <ReceiptItem key={idx}>
                <div className="main-info">
                  <strong>1x Helado en {item.base}</strong>
                  <span>{item.flavors.join(" • ")}</span>
                  {item.toppings?.length > 0 && (
                    <span>+ {item.toppings.map(t => t.name).join(", ")}</span>
                  )}
                </div>
                <div className="price">${item.finalPrice.toLocaleString()}</div>
              </ReceiptItem>
            ))}
          </ItemsList>

          <Divider />
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Envío Premium</span>
            <span>${ENVIO.toLocaleString()}</span>
          </SummaryRow>
          
          <SummaryRow $isTotal>
            <span>TOTAL</span>
            <span>${totalGeneral.toLocaleString()}</span>
          </SummaryRow>

          <Stamp>
            Calidad<br/>Velluto<br/>100% Real
          </Stamp>

          <div style={{ textAlign: 'center', color: '#a0a0a0', fontSize: '0.7rem' }}>
            <p style={{ fontWeight: 'bold' }}>Orden #VE-{Math.floor(1000 + Math.random() * 9000)}</p>
            <p>Gracias por apoyar lo artesanal.</p>
          </div>

          <Actions className="no-print">
            <Button onClick={() => window.print()}>Imprimir</Button>
            <Button $primary onClick={handleFinish}>Nueva Orden</Button>
          </Actions>
        </ReceiptContainer>
      </PageWrapper>
    </>
  );
}