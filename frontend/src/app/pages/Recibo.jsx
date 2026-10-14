import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

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
      box-shadow: none !important;
      margin: 0 auto !important;
    }

    @page {
      margin: 1.5cm;
      size: auto;
    }
  }
`;

const PageWrapper = styled.section`
  background: ${({ theme }) => theme.colors.background};
  padding: 4rem 1.5rem 6rem;
  min-height: 70vh;
`;

const Intro = styled.div`
  max-width: 560px;
  margin: 0 auto 2.5rem;
  text-align: center;
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
  margin: 0.5rem 0 1rem;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.7;
`;

const ReceiptCard = styled.div`
  max-width: 560px;
  margin: 0 auto;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  padding: 2.5rem 2rem;

  @media (max-width: 480px) {
    padding: 2rem 1.25rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.text};
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.dark};
    margin-top: 0.2rem;
  }
`;

const OrderNumber = styled.div`
  text-align: right;

  @media (max-width: 480px) {
    text-align: left;
  }

  span {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dark};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionLabel = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 1.8rem 0 0.8rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.2rem;
  }

  span {
    display: block;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.5;
  }

  .price {
    font-weight: 600;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.8rem;
  color: ${({ theme, $isTotal }) => ($isTotal ? theme.colors.text : theme.colors.dark)};
  font-weight: ${({ $isTotal }) => ($isTotal ? 700 : 400)};
  ${({ $isTotal, theme }) =>
    $isTotal &&
    `
    font-size: 1.4rem;
    font-family: ${theme.fonts.title};
    margin-top: 1.2rem;
    padding-top: 1.2rem;
    border-top: 1px solid ${theme.colors.border};
  `}
`;

const DeliveryBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;

  span {
    color: ${({ theme }) => theme.colors.dark};
  }
`;

const Thanks = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.9rem;
`;

const Actions = styled.div`
  max-width: 560px;
  margin: 1.5rem auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none !important;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
  border: 1px solid ${({ theme, $primary }) => ($primary ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $primary }) => ($primary ? theme.colors.primary : "white")};
  color: ${({ theme, $primary }) => ($primary ? "white" : theme.colors.text)};

  &:hover {
    background: ${({ theme, $primary }) => ($primary ? theme.colors.dark : theme.colors.background)};
    border-color: ${({ theme, $primary }) => ($primary ? theme.colors.dark : theme.colors.primary)};
  }
`;

const formatCOP = (val) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

export function Recibo() {
  const navigate = useNavigate();
  // La orden guardada en el backend llega desde la página Domicilio
  const order = useLocation().state?.order;

  if (!order) return <Navigate to="/ordenar" replace />;

  const fecha = new Date(order.createdAt).toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });

  return (
    <>
      <PrintStyles />
      <PageWrapper>
        <Intro className="no-print">
          <Eyebrow>Pedido confirmado</Eyebrow>
          <Title>¡Gracias por tu pedido!</Title>
          <Text>Ya estamos preparando tus helados. Este es tu recibo.</Text>
        </Intro>

        <ReceiptCard id="print-section">
          <CardHeader>
            <div>
              <h2>Velluto</h2>
              <small>Gelatería Artesanal · Neiva, Huila</small>
              <small>{fecha}</small>
            </div>
            <OrderNumber>
              <span>Orden</span>
              <strong>{order.orderNumber}</strong>
            </OrderNumber>
          </CardHeader>

          <SectionLabel>Tu pedido</SectionLabel>
          {order.items.map((item, idx) => (
            <Item key={idx}>
              <div>
                <strong>1x Helado en {item.base}</strong>
                <span>{item.flavors.join(" • ")}</span>
                {item.toppings?.length > 0 && <span>+ {item.toppings.map((t) => t.name).join(", ")}</span>}
              </div>
              <div className="price">{formatCOP(item.price)}</div>
            </Item>
          ))}

          <SummaryRow>
            <span>Subtotal</span>
            <span>{formatCOP(order.subtotal)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Domicilio</span>
            <span>{formatCOP(order.shippingFee)}</span>
          </SummaryRow>
          <SummaryRow $isTotal>
            <span>Total</span>
            <span>{formatCOP(order.total)}</span>
          </SummaryRow>

          <SectionLabel>Entrega</SectionLabel>
          <DeliveryBox>
            {order.delivery.nombre}
            <br />
            {order.delivery.direccion}
            <br />
            <span>Tel: {order.delivery.telefono}</span>
            {order.delivery.comentario && (
              <>
                <br />
                <span>Comentario: {order.delivery.comentario}</span>
              </>
            )}
          </DeliveryBox>

          <Thanks>Gracias por apoyar lo artesanal.</Thanks>
        </ReceiptCard>

        <Actions>
          <Button onClick={() => window.print()}>Imprimir recibo</Button>
          <Button $primary onClick={() => navigate("/ordenar")}>Nueva orden</Button>
        </Actions>
      </PageWrapper>
    </>
  );
}
