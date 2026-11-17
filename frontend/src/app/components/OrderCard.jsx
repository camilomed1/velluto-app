import styled, { css, useTheme } from "styled-components";

// Pasos del pedido en orden (cancelado va aparte)
export const PASOS = [
  { status: "pendiente", label: "Recibido" },
  { status: "preparando", label: "Preparando" },
  { status: "en camino", label: "En camino" },
  { status: "entregado", label: "Entregado" },
];

// Color de cada estado, siempre con los colores del tema
export const statusColors = (status, theme) =>
  ({
    pendiente: { bg: theme.colors.secondary, color: theme.colors.text },
    preparando: { bg: theme.colors.primary, color: "white" },
    "en camino": { bg: theme.colors.dark, color: "white" },
    entregado: { bg: theme.colors.success, color: "white" },
    cancelado: { bg: "#eee", color: theme.colors.text },
  })[status] || { bg: "#eee", color: theme.colors.text };

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.8rem 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};

  /* Los entregados quedan en verde para distinguirlos de un vistazo */
  ${({ $status, theme }) =>
    $status === "entregado" &&
    css`
      background: ${theme.colors.successLight};
      border-color: ${theme.colors.success};
      border-left: 6px solid ${theme.colors.success};
    `}

  ${({ $status }) =>
    $status === "cancelado" &&
    css`
      background: #fafafa;
      opacity: 0.7;
    `}

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;

  h3 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.3rem;
  }

  small {
    color: ${({ theme }) => theme.colors.dark};
  }
`;

export const StatusPill = styled.span`
  padding: 0.4rem 1rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: ${({ $status, theme }) => statusColors($status, theme).bg};
  color: ${({ $status, theme }) => statusColors($status, theme).color};
`;

// ---------- Barra de progreso ----------

const Steps = styled.ol`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0.5rem 0 1.5rem;
`;

const Step = styled.li`
  position: relative;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $done, theme }) => ($done ? theme.colors.text : "#b9aa9b")};

  /* Línea que une un paso con el anterior */
  &:not(:first-child)::before {
    content: "";
    position: absolute;
    top: 11px;
    right: 50%;
    width: 100%;
    height: 3px;
    background: ${({ $done, $color, theme }) => ($done ? $color : theme.colors.border)};
  }

  button {
    all: unset;
    cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    position: relative;
    width: 100%;

    &:focus-visible span {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: white;
    background: ${({ $done, $color, theme }) => ($done ? $color : theme.colors.border)};
    box-shadow: ${({ $current, $color }) => ($current ? `0 0 0 4px ${$color}33` : "none")};
    transition: 0.2s ease;
  }

  ${({ $clickable, theme }) =>
    $clickable &&
    css`
      button:hover span {
        transform: scale(1.15);
        box-shadow: 0 0 0 4px ${theme.colors.primary}33;
      }
    `}
`;

const CanceledNote = styled.p`
  margin: 0.5rem 0 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

// onStepClick (opcional): el admin puede tocar un paso para mover el pedido a ese estado
export function OrderSteps({ status, onStepClick }) {
  const theme = useTheme();
  if (status === "cancelado") return <CanceledNote>Este pedido fue cancelado.</CanceledNote>;

  const actual = PASOS.findIndex((p) => p.status === status);
  const color = statusColors(status, theme).bg;

  return (
    <Steps>
      {PASOS.map((paso, i) => (
        <Step key={paso.status} $done={i <= actual} $current={i === actual} $color={color} $clickable={!!onStepClick}>
          {onStepClick ? (
            <button type="button" onClick={() => i !== actual && onStepClick(paso.status)} title={`Cambiar a "${paso.label}"`}>
              <span>{i <= actual ? "✓" : i + 1}</span>
              {paso.label}
            </button>
          ) : (
            <button type="button" tabIndex={-1}>
              <span>{i <= actual ? "✓" : i + 1}</span>
              {paso.label}
            </button>
          )}
        </Step>
      ))}
    </Steps>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  strong { display: block; }
  span { display: block; font-size: 0.85rem; color: ${({ theme }) => theme.colors.dark}; line-height: 1.5; }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.9rem;

  .total {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const formatCOP = (val) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

// Hace cuánto se hizo el pedido, para que el admin vea cuáles llevan más tiempo esperando
const haceCuanto = (fecha) => {
  const min = Math.floor((Date.now() - new Date(fecha)) / 60000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  return null;
};

// Tarjeta de un pedido. "extra" sirve para agregar datos del cliente y acciones (admin, domiciliario)
export function OrderCard({ order, extra, onStepClick }) {
  const hace = haceCuanto(order.createdAt);

  return (
    <Card $status={order.status}>
      <Top>
        <div>
          <h3>Pedido {order.orderNumber}</h3>
          <small>
            {new Date(order.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
            {hace && !["entregado", "cancelado"].includes(order.status) && ` · ${hace}`}
          </small>
        </div>
        <StatusPill $status={order.status}>{order.status}</StatusPill>
      </Top>

      <OrderSteps status={order.status} onStepClick={onStepClick} />

      {order.items.map((item, idx) => (
        <Item key={idx}>
          <div>
            <strong>1x Helado en {item.base}</strong>
            <span>{item.flavors.join(" • ")}</span>
            {item.toppings?.length > 0 && <span>+ {item.toppings.map((t) => t.name).join(", ")}</span>}
          </div>
          <div>{formatCOP(item.price)}</div>
        </Item>
      ))}

      <Bottom>
        <div>
          Entrega en {order.delivery.direccion}
          {order.delivery.comentario && ` · ${order.delivery.comentario}`}
        </div>
        <div className="total">Total {formatCOP(order.total)}</div>
      </Bottom>

      {extra}
    </Card>
  );
}
