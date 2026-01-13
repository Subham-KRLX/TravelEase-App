// Enhanced HomeScreen Styled Components
// Add these styles to your HomeScreen.jsx file to replace the old ones

import styled from 'styled-components';

// Hero Section Enhancements
export const HeroContainerEnhanced = styled.div`
  height: 320px;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  
  @media (min-width: 640px) {
    height: 420px;
  }
  
  @media (min-width: 1024px) {
    height: 500px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.1) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
    z-index: 1;
  }

  @keyframes float {
    0%, 100% { transform: translate(0px, 0px); }
    50% { transform: translate(15px, -15px); }
  }
`;

export const HeroOverlayEnhanced = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(12, 10, 9, 0.5)' : 'rgba(0, 0, 0, 0.2)'};
  backdrop-filter: blur(2px);
  z-index: 2;
`;

export const HeroContentEnhanced = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 3;
  animation: fadeInContent 0.8s ease-out;
  
  @media (min-width: 640px) {
    padding: 24px;
  }

  @keyframes fadeInContent {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HeroBadgeEnhanced = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.98);
  padding: 10px 18px;
  border-radius: 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: slideInDown 0.6s ease-out;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HeroTitleEnhanced = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin-bottom: 12px;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  animation: slideInUp 0.7s ease-out 0.1s both;
  letter-spacing: -0.5px;
  
  @media (min-width: 640px) {
    font-size: 36px;
    margin-bottom: 16px;
  }
  
  @media (min-width: 1024px) {
    font-size: 52px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HeroHighlightEnhanced = styled.span`
  color: #fbbf24;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(120deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 640px) {
    font-size: 42px;
  }
  
  @media (min-width: 1024px) {
    font-size: 56px;
  }
`;

export const HeroSubtitleEnhanced = styled.p`
  font-size: 14px;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  animation: slideInUp 0.7s ease-out 0.2s both;
  
  @media (min-width: 640px) {
    font-size: 16px;
    margin-bottom: 28px;
    max-width: 500px;
  }
  
  @media (min-width: 1024px) {
    font-size: 18px;
    margin-bottom: 32px;
    max-width: 600px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HeroButtonEnhanced = styled.button`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
  transition: all 0.3s ease;
  animation: slideInUp 0.7s ease-out 0.3s both;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #1e40af;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(251, 191, 36, 0.6);
  }

  &:active {
    transform: translateY(-1px);
  }
  
  @media (min-width: 640px) {
    gap: 10px;
    padding: 16px 40px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Cards Enhancements
export const FeatureCardEnhanced = styled.div`
  flex: 1;
  min-width: 250px;
  background: linear-gradient(135deg, ${props => props.theme.card} 0%, ${props => props.theme.card}dd 100%);
  padding: 28px;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.primary}25;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary}40;

    &::before {
      opacity: 1;
    }
  }
`;

export const FeatureIconContainerEnhanced = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${props => props.theme.primary}25 0%, ${props => props.theme.primary}10 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  ${FeatureCardEnhanced}:hover & {
    background: linear-gradient(135deg, ${props => props.theme.primary}35 0%, ${props => props.theme.primary}20 100%);
    transform: scale(1.1) rotate(5deg);
  }
`;

export const ServiceCardEnhanced = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.card} 0%, ${props => props.theme.card}dd 100%);
  padding: 24px;
  border-radius: 16px;
  border: 2px solid ${props => props.theme.border || '#e2e8f0'};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
    transition: right 0.3s ease;
  }

  &:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    border-color: #cbd5e1;
    transform: translateY(-4px);

    &::before {
      right: 0;
    }
  }
`;

export const ServiceIconEnhanced = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, ${props => props.bg} 0%, ${props => props.bg}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px ${props => props.bg}40;
  transition: all 0.3s ease;

  ${ServiceCardEnhanced}:hover & {
    transform: scale(1.15) rotate(-5deg);
    box-shadow: 0 8px 25px ${props => props.bg}60;
  }
`;

export const DestinationCardEnhanced = styled.div`
  min-width: 280px;
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

export const CtaSectionEnhanced = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  margin: 24px 16px 40px;
  padding: 24px 16px;
  border-radius: 20px;
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(30, 64, 175, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
    border-radius: 50%;
  }
  
  @media (min-width: 640px) {
    margin: 32px 20px 50px;
    padding: 32px 24px;
  }
  
  @media (min-width: 1024px) {
    margin: 40px auto 60px;
    padding: 40px;
  }
`;

export const CtaButtonEnhanced = styled.button`
  background-color: #fff;
  color: #1e40af;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255,255,255,0.3);
  letter-spacing: 0.3px;

  &:hover {
    background-color: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.4);
  }
`;

export const CtaButtonSecondaryEnhanced = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid #fff;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;

  &:hover {
    background-color: rgba(255,255,255,0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
`;
