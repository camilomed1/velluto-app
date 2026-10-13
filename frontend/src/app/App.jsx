import React, { useRef, useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./theme";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Nosotros } from "./pages/Nosotros";
import { Contacto } from "./pages/Contacto";
import { Sabores } from "./pages/Sabores";
import { Domicilio } from "./pages/Domicilio";
import { Ordenar } from "./pages/Ordenar";
import { Recibo } from "./pages/Recibo"; 
import { Chatbot } from "./components/Chatbot"; 

const GlobalStyle = createGlobalStyle`
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    font-family:${({ theme }) => theme.fonts.body};
    background:${({ theme }) => theme.colors.background};
    color:${({ theme }) => theme.colors.text};
  }
  a{ text-decoration:none; color:inherit; }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageWrapper = ({ children }) => {
  const containerRef = useRef();
  const location = useLocation(); 

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [location.pathname]); 

  return <div ref={containerRef}>{children}</div>;
};

export default function App() {
  
  const [cart, setCart] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Header />
          
          <main style={{ flexGrow: 1 }}>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/sabores" element={<Sabores />} />
                <Route path="/domicilio" element={<Domicilio />} />
                
               
                <Route path="/ordenar" element={<Ordenar cart={cart} setCart={setCart} />} />
                
              
                <Route path="/recibo" element={<Recibo cart={cart} setCart={setCart} />} />
                
                <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}>Página no encontrada</div>} />
              </Routes>
            </PageWrapper>
          </main>

          <Footer />
          <Chatbot /> 
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}