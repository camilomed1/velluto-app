import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import {
  getAvailableDeliveriesRequest,
  getMyDeliveriesRequest,
  takeDeliveryRequest,
  completeDeliveryRequest,
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

const Extra = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.dark};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const Button = styled.button`
  padding: 0.9rem 1.6rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.dark};
`;

const Message = styled.p`
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

// ---------- Página ----------

const SECCIONES = [
  { key: "disponibles", label: "Disponibles" },
  { key: "camino", label: "En camino" },
  { key: "entregadas", label: "Entregadas" },
];

export function Entregas() {
  const { user } = useAuth();
  const [seccion, setSeccion] = useState("disponibles");
  const [disponibles, setDisponibles] = useState([]);
  const [mias, setMias] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    Promise.all([getAvailableDeliveriesRequest(), getMyDeliveriesRequest()])
      .then(([d, m]) => {
        setDisponibles(d);
        setMias(m);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  // Se actualiza solo cada 30 segundos para ver pedidos nuevos
  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const accion = async (id, request, siguiente) => {
    setBusy(id);
    setError("");
    try {
      await request(id);
      load();
      setSeccion(siguiente);
    } catch (err) {
      setError(err.message);
      load();
    } finally {
      setBusy(null);
    }
  };

  const enCamino = mias.filter((o) => o.status === "en camino");
  const entregadas = mias.filter((o) => o.status === "entregado");
  const lista = seccion === "disponibles" ? disponibles : seccion === "camino" ? enCamino : entregadas;
  const conteo = { disponibles: disponibles.length, camino: enCamino.length, entregadas: entregadas.length };

  const vacio = {
    disponibles: "No hay pedidos listos para entregar en este momento.",
    camino: "No tienes entregas en camino.",
    entregadas: "Todavía no has entregado pedidos.",
  };

  return (
    <PageWrapper>
      <Eyebrow>Hola, {user.username}</Eyebrow>
      <Title>Entregas</Title>

      <Tabs>
        {SECCIONES.map((s) => (
          <TabBtn key={s.key} $active={seccion === s.key} onClick={() => setSeccion(s.key)}>
            {s.label} ({conteo[s.key]})
          </TabBtn>
        ))}
      </Tabs>

      {error && <Message>{error}</Message>}
      {lista.length === 0 && <Empty>{vacio[seccion]}</Empty>}

      <List>
        {lista.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            extra={
              <Extra>
                <div>
                  Cliente: <strong>{order.delivery.nombre}</strong> · Tel:{" "}
                  <a href={`tel:${order.delivery.telefono}`}>{order.delivery.telefono}</a>
                </div>
                {seccion === "disponibles" && (
                  <Button disabled={busy === order._id} onClick={() => accion(order._id, takeDeliveryRequest, "camino")}>
                    Tomar pedido
                  </Button>
                )}
                {seccion === "camino" && (
                  <Button disabled={busy === order._id} onClick={() => accion(order._id, completeDeliveryRequest, "entregadas")}>
                    Marcar entregado
                  </Button>
                )}
              </Extra>
            }
          />
        ))}
      </List>
    </PageWrapper>
  );
}
