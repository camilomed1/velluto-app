import styled from "styled-components";
import { DeliverySection } from "../components/DeliverySection";


const PageWrapper = styled.div`
  padding: 2rem 0 4rem 0;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IntroBox = styled.div`
  max-width: 600px;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1.5rem;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 1rem;
    letter-spacing: -1px;
  }

  p {
    color: #4b5563;
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

const NoticeBanner = styled.div`
  border: 2px solid black;
  background-color: #fefce8; 
  padding: 1rem;
  margin-top: 2rem;
  max-width: 600px;
  width: 90%;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
`;



export function Domicilio() {
  return (
    <PageWrapper>
     
      <IntroBox>
        <h1>Helados a tu puerta</h1>
        <p>
          ¿No quieres salir de casa? No te preocupes. Llevamos tus sabores 
          favoritos directamente a tu mesa con la misma frescura de siempre.
        </p>
      </IntroBox>

      
      <DeliverySection />

    
      <NoticeBanner>
        ⚠️ Los pedidos fuera de la zona urbana pueden tener un recargo adicional de $2.00.
      </NoticeBanner>
    </PageWrapper>
  );
}