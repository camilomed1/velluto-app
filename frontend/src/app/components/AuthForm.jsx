import styled from "styled-components";
import { Link } from "react-router-dom";

// Estilos compartidos por Login y Registro (mismo look del formulario de Domicilio)
const Wrapper = styled.section`
  background: white;
  padding: 5rem 1.5rem;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 2.5rem 2rem;
  box-shadow: ${({ theme }) => theme.shadow.soft};
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 2.2rem;
  line-height: 1.1;
  margin: 0.5rem 0 1.8rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.9rem;
    background: white;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  border: none;
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const ErrorText = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Footer = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.dark};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

export function AuthForm({ eyebrow, title, footerText, footerLink, footerLabel, footerState, children }) {
  return (
    <Wrapper>
      <Card>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title>{title}</Title>
        {children}
        <Footer>
          {footerText} <Link to={footerLink} state={footerState}>{footerLabel}</Link>
        </Footer>
      </Card>
    </Wrapper>
  );
}
