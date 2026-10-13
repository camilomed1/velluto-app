import styled from "styled-components";
import heladero from '../../assets/nosotros/heladero.jpg';

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;


const HistoryHero = styled.section`
  width: 100%;
  height: 60vh;
  min-height: 450px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
    url(${heladero});
  background-size: cover;
  background-position: center;
  background-attachment: fixed; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 2rem;
  margin-bottom: 4rem;

  h1 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(3rem, 8vw, 4.5rem);
    margin-bottom: 1rem;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    font-weight: 300;
    letter-spacing: 1px;
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  padding: 4rem 0;
  align-items: center;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1.2fr;
  }
`;

const TextBlock = styled.div`
  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  .accent {
    color: ${({ theme }) => theme.colors.primary || '#d4a373'};
    font-weight: 700;
    font-size: 1.3rem;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.soft};

  span {
    display: block;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }

  label {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.dark};
    opacity: 0.7;
  }
`;

export function Nosotros() {
  return (
    <>
      <HistoryHero>
        <h1>Velluto</h1>
        <p>Tradición que se siente en el paladar desde 1995</p>
      </HistoryHero>

      <MainContent>
        <ContentSection>
          <TextBlock>
            <span className="accent">Nuestros Orígenes</span>
            <h2>De Italia para el Mundo</h2>
            <p>
              Todo comenzó en 1995, en un pequeño taller artesanal en el corazón de Italia. 
              Nuestra misión era simple pero ambiciosa: perfeccionar la textura del helado 
              hasta que se sintiera como terciopelo. De ahí nace nuestro nombre, <strong>Velluto</strong>.
            </p>
            <p>
              A lo largo de los años, hemos cruzado fronteras, pero nuestras máquinas 
              de mantecación lenta y nuestras recetas secretas siguen siendo las mismas 
              que usábamos hace tres décadas.
            </p>
          </TextBlock>

          <div style={{ 
            background: '#f9f9f9', 
            padding: '3rem', 
            borderRadius: '30px', 
            border: '1px solid #eee' 
          }}>
             <h3 style={{ marginBottom: '1.5rem', fontFamily: 'inherit' }}>El Secreto de la Calidad</h3>
             <p style={{ lineHeight: '1.7', color: '#555' }}>
               No utilizamos bases industriales. Cada sabor de Velluto se construye desde cero, 
               seleccionando frutas de temporada y frutos secos tostados por nosotros mismos. 
               Es la única forma de honrar nuestras raíces y garantizar que cada bocado 
               sea una obra de arte.
             </p>
          </div>
        </ContentSection>

        <div style={{ margin: '4rem 0 6rem 0' }}>
          <StatsGrid>
            <StatItem>
              <span>1995</span>
              <label>Año de Fundación</label>
            </StatItem>
            <StatItem>
              <span>100%</span>
              <label>Natural</label>
            </StatItem>
            <StatItem>
              <span>30+</span>
              <label>Sabores Únicos</label>
            </StatItem>
            <StatItem>
              <span>🇮🇹</span>
              <label>Receta Original</label>
            </StatItem>
          </StatsGrid>
        </div>
      </MainContent>
    </>
  );
}