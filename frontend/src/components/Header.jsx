import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, User, LogOut, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <HeaderContainer theme={theme}>
      <HeaderContent>
        <Logo to="/">
          <LogoIconWrapper>
            <Plane size={24} color="#fff" />
          </LogoIconWrapper>
          <LogoText>TravelEase</LogoText>
        </Logo>

        <NavLinks>
          <NavLinkItem to="/search">Explore</NavLinkItem>
          <NavLinkItem to="/search?type=hotels">Hotels</NavLinkItem>
          <NavLinkItem to="/search?type=packages">Packages</NavLinkItem>
        </NavLinks>

        <Actions>
          <IconButton onClick={toggleTheme} title="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          <IconButton onClick={() => navigate('/checkout')} style={{ position: 'relative' }} title="Cart">
            <ShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <Badge>
                <BadgeText>{getTotalItems()}</BadgeText>
              </Badge>
            )}
          </IconButton>

          {user ? (
            <UserSection>
              <IconButton onClick={() => navigate('/dashboard')} title="Dashboard">
                <User size={20} />
              </IconButton>
              <IconButton onClick={() => { logout(); navigate('/'); }} title="Logout">
                <LogOut size={20} />
              </IconButton>
            </UserSection>
          ) : (
            <AuthButtons>
              <LoginLink to="/login">Sign In</LoginLink>
              <SignUpButton to="/signup">Sign Up</SignUpButton>
            </AuthButtons>
          )}
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background: ${props => props.theme.headerBackground};
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.shadows?.sm || '0 1px 2px rgba(0,0,0,0.05)'};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
`;

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIconWrapper = styled.div`
  background: ${props => props.theme.primary};
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-10deg);
  box-shadow: 0 4px 12px rgba(0, 106, 255, 0.3);
`;

const LogoText = styled.span`
  color: ${props => props.theme.text};
  font-size: 22px;
  font-weight: 800;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.5px;
`;

const NavLinks = styled.nav`
  display: none;
  gap: 32px;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLinkItem = styled(NavLink)`
  text-decoration: none;
  color: ${props => props.theme.textSecondary};
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover, &.active {
    color: ${props => props.theme.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 8px;

  &:hover {
    background: ${props => props.theme.backgroundTertiary};
    color: ${props => props.theme.text};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${props => props.theme.accent};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${props => props.theme.surface};
`;

const BadgeText = styled.span`
  color: #fff;
  font-size: 9px;
  font-weight: 700;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoginLink = styled(NavLink)`
  text-decoration: none;
  color: ${props => props.theme.text};
  font-size: 15px;
  font-weight: 600;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const SignUpButton = styled(NavLink)`
  background: ${props => props.theme.primary};
  color: #fff;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 106, 255, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 106, 255, 0.3);
  }
`;

