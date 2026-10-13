import styled from "styled-components";



const DeliverySectionWrapper = styled.section`
  background: white;
  padding: 6rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
`;


const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  line-height: 1.1;
  font-family: ${({ theme }) => theme.fonts.title};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.7;
`;

const Benefit = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  border: 2px solid black;
  padding: 1.5rem;
  background-color: white;
  text-align: center; 
  
  h3 {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #000;
  }
  
  p {
    font-size: 0.9rem;
    color: #4b5563;
    margin: 0;
  }
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input, textarea {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.9rem;
    background: white;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  border: none;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
  }
`;
// --- Componente ---

export function DeliverySection() {
  return (
    <DeliverySectionWrapper>
      <Container>

        <LeftContent>
          <Eyebrow>Domicilio</Eyebrow>

          <Title>
            Tu helado favorito, directo a casa
          </Title>

          <Text>
            Entregamos rápido para que disfrutes cada sabor con la textura perfecta.
          </Text>

          <Benefit>✓ Menos de 30 minutos</Benefit>
          <Benefit>✓ Cobertura en toda la ciudad</Benefit>
          <Benefit>✓ Atención todos los días</Benefit>
        </LeftContent>

        <FormContainer>
          <h3>Solicita tu pedido</h3>

          <form>
            <FormGroup>
              <label>Dirección</label>
              <input type="text" />
            </FormGroup>

            <FormGroup>
              <label>Teléfono</label>
              <input type="text" />
            </FormGroup>

            <FormGroup>
              <label>Notas</label>
              <textarea rows="3" />
            </FormGroup>

            <SubmitButton>
              Pedir ahora
            </SubmitButton>
          </form>
        </FormContainer>

      </Container>
    </DeliverySectionWrapper>
  );
}