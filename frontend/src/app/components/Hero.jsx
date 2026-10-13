import React, { useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import heroImage from '../../assets/hero.png';

const HeroContainer = styled.section`
  min-height: 88vh;
  background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 6%;
  overflow: hidden;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  opacity: 0;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.9rem;
  display: block;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(2.5rem, 8vw, 4.6rem);
  line-height: 1.05;
  color: white;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.95);
  max-width: 500px;
`;

const CTA = styled.button`
  width: fit-content;
  padding: 1.1rem 2.2rem;
  border: none;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.1);
    box-shadow: 0 8px 25px rgba(230, 126, 34, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef();

  useGSAP(() => {
    
    gsap.to(".hero-content-anim", {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power4.out",
      startAt: { x: -50 }
    });

    
    gsap.fromTo(containerRef.current, 
      { backgroundScale: 1.1 }, 
      { backgroundPosition: "center", duration: 2 }
    );
  }, { scope: containerRef });

  return (
    <HeroContainer ref={containerRef}>
      {/* El gradiente se integró directamente en el HeroContainer para optimizar el DOM */}
      <HeroContent className="hero-content-anim">
        <Eyebrow>Helados artesanales</Eyebrow>

        <Title>
          Sabores hechos para disfrutarse lento
        </Title>

        <Subtitle>
          Ingredientes reales, recetas cuidadas y una experiencia pensada para compartir.
        </Subtitle>

        <CTA onClick={() => navigate('/ordenar')}>
          Ordenar ahora
        </CTA>
      </HeroContent>
    </HeroContainer>
  );
}