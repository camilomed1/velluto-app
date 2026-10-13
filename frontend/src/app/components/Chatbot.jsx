import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { SABORES } from "../../data/sabores.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";



const ChatContainer = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ChatWindow = styled.div`
  width: 360px;
  height: 520px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 15px;
`;

const ChatHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1.2rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 1.2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fcfcfc;
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.4;
  background: ${props => props.$isUser ? props.theme.colors.primary : '#ffffff'};
  color: ${props => props.$isUser ? 'white' : props.theme.colors.text};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  border: ${props => props.$isUser ? 'none' : `1px solid #eee`};
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  white-space: pre-line;
`;

const SuggestionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 1.2rem 1rem 1.2rem;
  background: #fcfcfc;
`;

const SuggestionButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primary}; color: white; }
`;

const FloatingButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.6rem;
  box-shadow: 0 5px 15px rgba(230, 126, 34, 0.4);
`;



export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Bienvenido a Velluto 🍨. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", sender: "bot" }
  ]);

  const scrollRef = useRef(null);

  
  const RESPUESTAS_DEFAULT = {
    "menu": () => {
      let menu = "🍦 *Nuestros Sabores Artesanales* 🍦\n\n";
      SABORES.forEach(s => menu += `• ${s.name}: $${s.price.toLocaleString()}\n`);
      menu += "\n¿Cuál te gustaría probar?";
      return menu;
    },
    "ubicacion": "📍 Estamos ubicados en Neiva, Huila. ¡Cerca de la Universidad Surcolombiana!",
    "horarios": "🕒 Atendemos todos los días:\nLunes a Sábado: 10:00 AM - 9:00 PM\nDomingos: 11:00 AM - 8:00 PM",
    "domicilio": "🛵 ¡Sí! Hacemos domicilios en toda la ciudad. Puedes armar tu pedido en la sección 'Ordenar'.",
    "default": "No estoy seguro de entender eso, pero puedes usar los botones de arriba para conocer más sobre nosotros. ✨"
  };

  const BOTONES_SUGERENCIA = [
    { label: "🍦 Ver Menú", key: "menu" },
    { label: "📍 Ubicación", key: "ubicacion" },
    { label: "🕒 Horarios", key: "horarios" },
    { label: "🛵 Domicilios", key: "domicilio" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const procesarAccion = (key, label) => {
    const textoUsuario = label;
    let respuestaBot = "";

    
    if (typeof RESPUESTAS_DEFAULT[key] === "function") {
      respuestaBot = RESPUESTAS_DEFAULT[key]();
    } else {
      respuestaBot = RESPUESTAS_DEFAULT[key] || RESPUESTAS_DEFAULT["default"];
    }

    setMessages(prev => [
      ...prev,
      { text: textoUsuario, sender: "user" },
      { text: respuestaBot, sender: "bot" }
    ]);
  };

  useGSAP(() => {
    gsap.to(".btn-float", { y: -10, repeat: -1, yoyo: true, duration: 1.5, ease: "sine.inOut" });
  }, []);

  return (
    <ChatContainer>
      <ChatWindow $isOpen={isOpen}>
        <ChatHeader>
          <span>Velluto Asistente ✨</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)}>×</span>
        </ChatHeader>

        <MessageArea ref={scrollRef}>
          {messages.map((msg, index) => (
            <Bubble key={index} $isUser={msg.sender === "user"}>
              {msg.text}
            </Bubble>
          ))}
        </MessageArea>

        <SuggestionsWrapper>
          <p style={{ width: '100%', fontSize: '0.75rem', opacity: 0.6, marginBottom: '5px' }}>Selecciona una opción:</p>
          {BOTONES_SUGERENCIA.map((btn, i) => (
            <SuggestionButton key={i} onClick={() => procesarAccion(btn.key, btn.label)}>
              {btn.label}
            </SuggestionButton>
          ))}
        </SuggestionsWrapper>
      </ChatWindow>

      <FloatingButton className="btn-float" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "×" : "💬"}
      </FloatingButton>
    </ChatContainer>
  );
}