import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useProducts } from "../context/ProductsContext";
import { imageUrl } from "../../api/api";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PageWrapper = styled.div`
  padding: 4rem 1rem;
  max-width: 1100px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 450px;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow.soft};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 15px rgba(201, 126, 90, 0.15);
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryBtn = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  border: none;
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : '#eee'};

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : '#f8f8f8'};
    transform: translateY(-2px);
  }
`;

const FlavorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// --- TARJETA CON HOVER DE DESCRIPCIÓN ---
const FlavorItemCard = styled.div`
  position: relative;
  height: 350px;
  border-radius: 25px;
  overflow: hidden;
  background: white;
  box-shadow: ${({ theme }) => theme.shadow.soft};
  cursor: pointer;

  .image-container {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .info-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    color: white;
    text-align: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    
    h3 {
      font-family: ${({ theme }) => theme.fonts.title};
      font-size: 1.8rem;
      margin-bottom: 0.8rem;
      transform: translateY(20px);
      transition: transform 0.4s ease;
    }

    p {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      transform: translateY(20px);
      transition: transform 0.4s ease 0.1s;
    }

    .price-tag {
      font-weight: 700;
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.primary};
      transform: translateY(20px);
      transition: transform 0.4s ease 0.2s;
    }

    .order-hint {
      margin-top: 1rem;
      padding: 0.5rem 1.2rem;
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 600;
      transform: translateY(20px);
      transition: transform 0.4s ease 0.3s;
    }
  }

  &:hover,
  &:focus-visible {
    .image-container img {
      transform: scale(1.1);
    }
    .info-overlay {
      opacity: 1;
      h3, p, .price-tag, .order-hint {
        transform: translateY(0);
      }
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

// Botón con el terracota del tema (antes usaba otro naranja)
const CTAButton = styled.button`
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.dark};
    transform: scale(1.05);
  }
`;

// Etiqueta "Agotado" sobre la foto
const SoldOutBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  padding: 0.4rem 1rem;
  border-radius: 25px;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const OrderCTA = styled.div`
  margin-top: 5rem;
  text-align: center;
  background: #fff5eb;
  padding: 4rem;
  border-radius: 30px;
`;

export function Sabores() {
  const navigate = useNavigate();

  // Lleva a Ordenar con este sabor ya agregado como primera bola
  const pedir = (flavor) => {
    if (flavor.agotado) return;
    navigate("/ordenar", { state: { sabor: flavor._id } });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const { sabores, categorias: listaCategorias } = useProducts();
  // Las categorías las crea el admin; solo mostramos las que tienen sabores
  const categorias = ["Todos", ...listaCategorias.filter((c) => sabores.some((s) => s.category === c.name)).map((c) => c.name)];
  const filteredFlavors = sabores.filter(flavor => {
    const matchesSearch = flavor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || flavor.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Animación de entrada de la lista
  useGSAP(() => {
    gsap.fromTo(".flavor-item-anim", 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, [filteredFlavors]);

  return (
    <PageWrapper>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>Nuestro Menú</h1>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Pasa el mouse sobre un sabor para conocer su historia</p>
      </div>

      <FilterSection>
        <SearchInput 
          type="text" 
          placeholder="Busca tu sabor favorito..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CategoryContainer>
          {categorias.map(cat => (
            <CategoryBtn 
              key={cat} 
              $active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </CategoryBtn>
          ))}
        </CategoryContainer>
      </FilterSection>

      <FlavorsGrid>
        {filteredFlavors.map((flavor) => (
          <div key={flavor._id} className="flavor-item-anim">
            <FlavorItemCard
              role="button"
              tabIndex={flavor.agotado ? -1 : 0}
              aria-label={flavor.agotado ? `${flavor.name} (agotado)` : `Pedir ${flavor.name}`}
              style={flavor.agotado ? { cursor: "not-allowed" } : undefined}
              onClick={() => pedir(flavor)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pedir(flavor))}
            >
              {flavor.agotado && <SoldOutBadge>Agotado</SoldOutBadge>}
              <div className="image-container" style={flavor.agotado ? { filter: "grayscale(0.7)" } : undefined}>
                <img src={imageUrl(flavor.image)} alt={flavor.name} />
              </div>
              <div className="info-overlay">
                <h3>{flavor.name}</h3>
                <p>{flavor.description}</p>
                <div className="price-tag">
                    {new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP', 
                        maximumFractionDigits: 0 
                    }).format(flavor.price)}
                </div>
                <span className="order-hint">{flavor.agotado ? "Agotado por ahora" : "Toca para pedir"}</span>
              </div>
            </FlavorItemCard>
          </div>
        ))}
      </FlavorsGrid>

      <OrderCTA>
        <h2 style={{ marginBottom: '1.5rem' }}>¿Quieres algo personalizado?</h2>
        <CTAButton onClick={() => navigate("/ordenar")}>
          ¡Armar mi Helado!
        </CTAButton>
      </OrderCTA>   
    </PageWrapper>
  );
}