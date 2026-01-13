import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoAirplane, IoSunny, IoMoon, IoCart, IoPerson, IoLogOutOutline } from 'react-icons/io5';
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
        <Logo to="/" theme={theme}>
          <IoAirplane size={24} color={theme.headerText} />
          <LogoText theme={theme}>TravelEase</LogoText>
        </Logo>

        <Actions>
          <IconButton onClick={toggleTheme} theme={theme}>
            {isDarkMode ?
              <IoSunny size={24} color={theme.headerText} /> :
              <IoMoon size={24} color={theme.headerText} />
            }
          </IconButton>

          <IconButton onClick={() => navigate('/checkout')} theme={theme} style={{ position: 'relative' }}>
            <IoCart size={24} color={theme.headerText} />
            {getTotalItems() > 0 && (
              <Badge>
                <BadgeText>{getTotalItems()}</BadgeText>
              </Badge>
            )}
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={() => navigate('/dashboard')} theme={theme}>
                <IoPerson size={24} color={theme.headerText} />
              </IconButton>
              <IconButton onClick={() => { logout(); navigate('/'); }} theme={theme}>
                <IoLogOutOutline size={24} color={theme.headerText} />
              </IconButton>
            </>
          ) : (
            <LoginButton to="/login" theme={theme}>
              Login
            </LoginButton>
          )}
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  );
}

// Styled Components
const HeaderContainer = styled.header`
  background-color: ${props => props.theme.headerBackground || '#1e40af'};
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (min-width: 640px) {
    padding: 16px 24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 8px;
  
  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const Logo = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  gap: 8px;
`;

const LogoText = styled.span`
  color: ${props => props.theme.headerText || '#fff'};
  font-size: 18px;
  font-weight: bold;
  
  @media (min-width: 640px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    display: none; /* Hide text on very small screens */
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  min-width: 40px; /* Touch-friendly */
  min-height: 40px;

  &:hover {
    opacity: 0.8;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ef4444;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BadgeText = styled.span`
  color: #fff;
  font-size: 10px;
  font-weight: bold;
`;

const LoginButton = styled(NavLink)`
  background-color: ${props => props.theme.headerText || '#fff'};
  color: ${props => props.theme.headerBackground || '#1e40af'};
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
  
  @media (min-width: 640px) {
    padding: 8px 16px;
    font-size: 15px;
  }
`;
