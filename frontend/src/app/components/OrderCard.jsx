import styled from "styled-components";

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.8rem 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};
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
  background: ${({ $status, theme }) =>
    $status === "entregado" ? theme.colors.dark : $status === "cancelado" ? "#eee" : theme.colors.primary};
  color: ${({ $status, theme }) => ($status === "cancelado" ? theme.colors.text : "white")};
`;

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

// Tarjeta de un pedido. "extra" sirve para que el admin agregue datos del cliente y acciones
export function OrderCard({ order, extra }) {
  return (
    <Card>
      <Top>
        <div>
          <h3>Pedido {order.orderNumber}</h3>
          <small>{new Date(order.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</small>
        </div>
        <StatusPill $status={order.status}>{order.status}</StatusPill>
      </Top>

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
