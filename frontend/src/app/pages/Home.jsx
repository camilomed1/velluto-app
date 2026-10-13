import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Hero } from "../components/Hero";
import { FlavorCard } from "../components/FlavorCard";
import { SABORES } from "../../data/sabores.js";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import imgNatural from "../../assets/porqueelegirnos/vanilla.jpg";
import imgArtesanal from "../../assets/porqueelegirnos/vanilla2.jpg";
import imgSabores from "../../assets/porqueelegirnos/helados1.jpg";

gsap.registerPlugin(ScrollTrigger);

const MainContent = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: clip; 
  position: relative;
  width: 100%;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;

  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 2.8rem;
    margin-bottom: 0.8rem;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -1px;
  }

  p {
    color: #7f8c8d;
    max-width: 620px;
    margin: 0 auto;
    line-height: 1.7;
    font-size: 1.1rem;
  }
`;


const SwiperWrapper = styled.div`
  position: relative;
  margin: 0 auto; 
  width: 100%;

  .swiper {
    padding: 1rem 1rem 4rem 1rem !important;
    overflow: hidden !important; 
  }

 
  .swiper-slide {
    display: flex;
    justify-content: center;
    
   
    img {
      aspect-ratio: 1 / 1; 
      object-fit: cover;
      border-radius: 20px; 
      width: 100%;
      max-width: 280px; 
      margin: 0 auto;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    }
  }

  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: #2c3e50;
    opacity: 0.2;
  }

  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.primary};
    opacity: 1;
    width: 20px;
    border-radius: 4px;
  }
`;

const ContactCTA = styled.section`
  background: white;
  border-radius: 40px;
  padding: 6rem 2rem;
  text-align: center;
  margin: 6rem auto;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 4rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-weight: 800;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    color: #7f8c8d;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    margin-left: auto;
    margin-right: auto;
  }

  button {
    background: #cd855f;
    color: white;
    border: none;
    padding: 1rem 3.5rem;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #b56e4a;
      transform: scale(1.03);
    }
  }
`;

const WhyUsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InfoCard = styled.div`
  position: relative;
  height: 320px;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  padding: 2.5rem;
  color: white;
  transition: all 0.4s ease;
  opacity: 0;
  border: 1px solid rgba(255,255,255,0.1);

  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent), 
    url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;

  &:hover {
    transform: translateY(-10px);
    &::after { opacity: 1; }
  }

  h3 {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    font-family: ${({ theme }) => theme.fonts.title};
    z-index: 2;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
    z-index: 2;
  }
`;

export function Home() {
  const destacados = SABORES.slice(0, 6);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.utils.toArray(".reveal-header").forEach((header) => {
      gsap.to(header, {
        scrollTrigger: { trigger: header, start: "top 85%" },
        opacity: 1,
        y: -10,
        duration: 1,
        ease: "power3.out"
      });
    });

    gsap.to(".info-card", {
      scrollTrigger: { trigger: ".why-us-section", start: "top 75%" },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
  }, []);

  return (
    <>
      <Hero />
      <MainContent>
        <div style={{ marginTop: '5rem' }}>
          <SectionHeader className="reveal-header">
            <h2>Sabores Destacados</h2>
            <p>Una selección artesanal de nuestras creaciones más queridas.</p>
          </SectionHeader>
          
          <SwiperWrapper>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true} 
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              grabCursor={true}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {destacados.map((flavor) => (
                <SwiperSlide key={flavor.id}>
                  <FlavorCard
                    name={flavor.name}
                    description={flavor.description}
                    price={flavor.price} 
                    image={flavor.image} 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperWrapper>
        </div>

        <ContactCTA className="contact-anim">
          <h2>¿Antojo de algo especial?</h2>
          <p>Estamos listos para llevar la experiencia Velluto a tu puerta o resolver cualquier duda.</p>
          <button onClick={() => navigate("/contacto")}>
            Escríbenos
          </button>
        </ContactCTA>
        
        <div className="why-us-section" style={{ marginBottom: '6rem' }}>
          <SectionHeader className="reveal-header">
            <h2>Experiencia Velluto</h2>
            <p>Lo que nos hace diferentes en cada cucharada.</p>
          </SectionHeader>

          <WhyUsGrid>
            <InfoCard className="info-card" $bgImage={imgNatural}>
              <h3>Natural</h3>
              <p>Sin colorantes artificiales, solo fruta y cremas reales.</p>
            </InfoCard>
            <InfoCard className="info-card" $bgImage={imgArtesanal}>
              <h3>Artesanal</h3>
              <p>Procesos lentos para una textura inigualable.</p>
            </InfoCard>
            <InfoCard className="info-card" $bgImage={imgSabores}>
              <h3>Único</h3>
              <p>Sabores exclusivos desarrollados en nuestro taller.</p>
            </InfoCard>
          </WhyUsGrid>
        </div>
      </MainContent>
    </>
  );
}