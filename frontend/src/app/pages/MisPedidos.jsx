import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersRequest } from "../../api/api";
import { OrderCard } from "../components/OrderCard";

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
  font-size: 3rem;
  line-height: 1.1;
  margin: 0.5rem 0 2.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
    padding: 0.9rem 2rem;
    border: none;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.dark};
    }
  }
`;

export function MisPedidos() {
  const { user } = useAuth();
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

  return (
    <PageWrapper>
      <Eyebrow>Hola, {user.username}</Eyebrow>
      <Title>Mis pedidos</Title>

      {loading && <Empty>Cargando tus pedidos...</Empty>}
      {error && <Empty>{error}</Empty>}

      {!loading && !error && orders.length === 0 && (
        <Empty>
          <p>Todavía no has hecho ningún pedido.</p>
          <button onClick={() => navigate("/ordenar")}>Armar mi helado</button>
        </Empty>
      )}

      <List>
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </List>
    </PageWrapper>
  );
}
