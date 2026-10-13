import { useState } from "react";
import styled from "styled-components";

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



export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    alert(`Buscando pedido: ${orderNumber}`);
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
              placeholder="Ingresa tu número de pedido (ej: 12345)"
              required
            />
            <TrackButton type="submit">
              Rastrear
            </TrackButton>
          </StyledForm>

          <InfoText>
            <p>Ingresa tu número de pedido para ver el seguimiento</p>
            <p>Puedes encontrar tu número de pedido en el correo de confirmación</p>
          </InfoText>
        </FormBox>
      </Container>
    </TrackSection>
  );
}