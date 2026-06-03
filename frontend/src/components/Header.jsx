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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 58%, #f97316 140%);
  padding: 14px 16px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.18);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  
  @media (min-width: 640px) {
    padding: 16px 24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1180px;
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
  gap: 10px;
`;

const LogoText = styled.span`
  color: ${props => props.theme.headerText || '#fff'};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0;
  
  @media (min-width: 640px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    display: none;
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
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 40px;
  min-height: 40px;
  border-radius: 8px;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
`;

const BadgeText = styled.span`
  color: #fff;
  font-size: 10px;
  font-weight: bold;
`;

const LoginButton = styled(NavLink)`
  background: #ffffff;
  color: #ea580c;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(255, 255, 255, 0.16);
  letter-spacing: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: 640px) {
    padding: 10px 24px;
    font-size: 15px;
  }
`;
