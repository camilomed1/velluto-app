import React from "react";
import styled from "styled-components";


import imgContacto from "../../assets/contacto/comiendohelado.jpg"; 

const RadioSection = styled.div`
  margin-bottom: 1.5rem;
  
  label.main-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.8rem;
    display: block;
    padding-left: 0.5rem;
  }
`;

const RadioGroupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: 0.2s;

  input {
    appearance: none; 
    width: 18px;
    height: 18px;
    border: 2px solid white;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:checked {
      border-color: ${({ theme }) => theme.colors.primary};
      background: rgba(255, 255, 255, 0.2);
      
      &::after {
        content: "";
        width: 10px;
        height: 10px;
        background-color: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
      }
    }
  }

  &:hover {
    opacity: 0.8;
  }
`;

const ContactHero = styled.section`
  width: 100%;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
    url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const FormContainer = styled.div`

  background: rgba(255, 255, 255, 0.15); 
  backdrop-filter: blur(15px); 
  -webkit-backdrop-filter: blur(15px);
  
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  border-radius: 30px;
  
 
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 2.8rem;
    color: white; 
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  p {
    color: white;
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-left: 0.5rem;
  }

  input, textarea {
    
    background: rgba(255, 255, 255, 0.9); 
    border: 1px solid transparent;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 15px;
    outline: none;
    transition: 0.3s ease;
    width: 100%;

    &:focus {
      background: white;
      border-color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.01);
    }
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary || '#e67e22'};
  color: white;
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 1rem;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
`;

const ContactInfo = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  color: white;

  p { margin: 0.3rem 0; }
  span { font-weight: 700; }
`;

export function Contacto() {
  return (
    <ContactHero $bgImage={imgContacto}>
      <FormContainer>
        <SectionHeader>
          <h1>Contacto</h1>
          <p>¿En qué podemos ayudarte hoy?</p>
        </SectionHeader>

        <form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <label>Nombre Completo</label>
            <input type="text" placeholder="Ej: Juan Pérez" required />
          </FormGroup>

         
          <RadioSection>
            <label className="main-label">Motivo del contacto</label>
            <RadioGroupContainer>
              <RadioOption>
                <input type="radio" name="motivo" value="pedido" defaultChecked />
                Pedido
              </RadioOption>
              <RadioOption>
                <input type="radio" name="motivo" value="franquicia" />
                Franquicia
              </RadioOption>
              <RadioOption>
                <input type="radio" name="motivo" value="sugerencia" />
                Sugerencia
              </RadioOption>
            </RadioGroupContainer>
          </RadioSection>
         

          <FormGroup>
            <label>Correo Electrónico</label>
            <input type="email" placeholder="tu@email.com" required />
          </FormGroup>

          <FormGroup>
            <label>Mensaje</label>
            <textarea placeholder="Cuéntanos más..." rows={3} required />
          </FormGroup>

          <SendButton type="submit">Enviar Mensaje</SendButton>
        </form>

        <ContactInfo>
          <p>Email: <span>hola@velluto.com</span></p>
          <p>WhatsApp: <span>+57 300 888 9999</span></p>
        </ContactInfo>
      </FormContainer>
    </ContactHero>
  );
}