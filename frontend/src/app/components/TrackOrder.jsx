import { useState } from "react";
import styled from "styled-components";
import { trackOrderRequest } from "../../api/api";

const TrackSection = styled.section`
  border-top: 2px solid black;
  background-color: white;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderTitle = styled.div`
  border: 2px solid black;
  background-color: #f3f4f6; 
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  text-align: center; 

  h2 {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
`;

const FormBox = styled.div`
  border: 2px solid black;
  padding: 1.5rem;
  background-color: white;
`;

const StyledForm = styled.form`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  border: 2px solid black;
  padding: 0.5rem 1rem;
  background-color: white;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    background-color: #fafafa;
  }
`;

const TrackButton = styled.button`
  border: 2px solid black;
  border-radius: 9999px;
  padding: 0.5rem 2rem;
  background-color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const InfoText = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #4b5563;
  font-size: 0.875rem;

  p:last-child {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
`;



const ResultBox = styled.div`
  margin-top: 1.5rem;
  border: 2px solid black;
  padding: 1rem 1.5rem;
  background-color: #f3f4f6;
  text-align: center;

  h3 {
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #000;
  }

  p {
    font-size: 0.9rem;
    color: #4b5563;
    margin: 0.25rem 0;
  }

  strong {
    text-transform: uppercase;
    color: #1f2937;
  }
`;

const formatCOP = (val) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      setResult(await trackOrderRequest(orderNumber.trim()));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <TrackSection>
      <Container>
        
        <HeaderTitle>
          <h2>Seguir tu Pedido</h2>
        </HeaderTitle>

        <FormBox>
          <StyledForm onSubmit={handleTrack}>
            <input type="hidden" name="form-name" value="track-order" />
            <Input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ingresa tu número de pedido (ej: VE-12345)"
              required
            />
            <TrackButton type="submit">
              Rastrear
            </TrackButton>
          </StyledForm>

          {result && (
            <ResultBox>
              <h3>Pedido {result.orderNumber}</h3>
              <p>Estado: <strong>{result.status}</strong></p>
              <p>{result.cantidad} {result.cantidad === 1 ? "helado" : "helados"} · Total {formatCOP(result.total)}</p>
              <p>Realizado el {new Date(result.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</p>
            </ResultBox>
          )}

          {error && (
            <ResultBox>
              <p>{error}</p>
            </ResultBox>
          )}

          <InfoText>
            <p>Ingresa tu número de pedido para ver el seguimiento</p>
            <p>Puedes encontrar tu número de pedido en tu recibo o en "Mis pedidos"</p>
          </InfoText>
        </FormBox>
      </Container>
    </TrackSection>
  );
}