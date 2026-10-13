import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom'; 

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadow.soft};
`;

const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const LogoBox = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.4rem;
`;

const NavLink = styled(Link)`
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.25s ease;
  position: relative;
  
 
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.text};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

 
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

const SpecialLink = styled(Link)`
  padding: 0.65rem 1.2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.dark};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

export function Header() {
  
  const location = useLocation();

  
  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <Wrapper>
        
        <LogoBox to="/">
          <h2 style={{ margin: 0 }}>Velluto</h2>
        </LogoBox>

        <Nav>
          {/* 2. Pasamos la prop $active comparando la ruta */}
          <NavLink to="/" $active={isActive('/')}>Inicio</NavLink>
          <NavLink to="/nosotros" $active={isActive('/nosotros')}>Nosotros</NavLink>
          <NavLink to="/sabores" $active={isActive('/sabores')}>Sabores</NavLink>
          <NavLink to="/contacto" $active={isActive('/contacto')}>Contacto</NavLink>
        </Nav>

        <SpecialLink to="/ordenar">Ordenar</SpecialLink>
      </Wrapper>
    </HeaderContainer>
  );
}