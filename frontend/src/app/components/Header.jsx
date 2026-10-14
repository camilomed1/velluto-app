import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  /* En pantallas pequeñas el menú se despliega debajo del header */
  @media (max-width: 900px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    padding: 1.5rem 2rem;
    background: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.soft};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.45rem 0.7rem;
  font-size: 1.2rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 900px) {
    display: block;
  }
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

// Mismo estilo que NavLink pero como botón (para "Salir")
const NavButton = styled.button`
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: 0.25s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú del celular al cambiar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Primero salimos de la página protegida para que no nos mande a /login
  const handleLogout = () => {
    navigate("/");
    logout();
  };

  
  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <Wrapper>
        
        <LogoBox to="/">
          <h2 style={{ margin: 0 }}>Velluto</h2>
        </LogoBox>

        <Nav $open={menuOpen}>
          {/* 2. Pasamos la prop $active comparando la ruta */}
          <NavLink to="/" $active={isActive('/')}>Inicio</NavLink>
          <NavLink to="/nosotros" $active={isActive('/nosotros')}>Nosotros</NavLink>
          <NavLink to="/sabores" $active={isActive('/sabores')}>Sabores</NavLink>

          {user ? (
            <>
              {isAdmin
                ? <NavLink to="/admin" $active={isActive('/admin')}>Admin</NavLink>
                : <NavLink to="/mi-cuenta" $active={isActive('/mi-cuenta')}>Mi cuenta</NavLink>}
              <NavButton onClick={handleLogout}>Salir</NavButton>
            </>
          ) : (
            <NavLink to="/login" $active={isActive('/login') || isActive('/registro')}>Ingresar</NavLink>
          )}
        </Nav>

        <Right>
          <SpecialLink to="/ordenar">Ordenar</SpecialLink>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
            {menuOpen ? '✕' : '☰'}
          </MenuButton>
        </Right>
      </Wrapper>
    </HeaderContainer>
  );
}