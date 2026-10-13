import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebookF,
  faTiktok,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  margin-top: 2rem;
`;

const FooterWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem;

  display: grid;
 
  grid-template-columns: 1fr; 
  gap: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: start;
  }
`;

const Brand = styled.div`
  text-align: left;
  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    margin-bottom: 0.5rem;
  }
  p {
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
    max-width: 300px;
  }
`;

const Contact = styled.div`
 
  @media (min-width: 768px) {
    text-align: center;
    margin: 0 auto;
  }

  h3 { margin-bottom: 0.8rem; }
  p {
    margin: 0.4rem 0;
    color: rgba(255,255,255,0.82);
  }
`;

const SocialSection = styled.div`
 
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  h3 { margin-bottom: 0.8rem; }
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const SocialIcon = styled.a`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: 0.25s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  padding: 1rem;
  color: rgba(255,255,255,0.65);
  font-size: 0.85rem;
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterWrapper>
        <Brand>
          <h2>Velluto</h2>
          <p>
            Helados artesanales creados con ingredientes reales y momentos para recordar.
          </p>
        </Brand>

        <Contact>
          <h3>Contacto</h3>
          <p><FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} /> +57 300 123 4567</p>
          <p>Neiva, Colombia</p>
          <p>Lunes a Domingo · 10AM - 10PM</p>
        </Contact>

        <SocialSection>
          <h3>Síguenos</h3>
          <SocialContainer>
            <SocialIcon href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></SocialIcon>
            <SocialIcon href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></SocialIcon>
            <SocialIcon href="#" aria-label="X"><FontAwesomeIcon icon={faXTwitter} /></SocialIcon>
            <SocialIcon href="#" aria-label="Tiktok"><FontAwesomeIcon icon={faTiktok} /></SocialIcon>
          </SocialContainer>
        </SocialSection>
      </FooterWrapper>

      <BottomBar>
        © {currentYear} Velluto. Todos los derechos reservados.
      </BottomBar>
    </FooterContainer>
  );
}