import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plane,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AuthCard>
        <div className="card-header">
          <div className="logo">
            <Plane size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Enter your details to access your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <button type="button" className="forgot">Forgot?</button>
            </div>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Sign In'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-grid">
          <button className="social-btn">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Google
          </button>
          <button className="social-btn">
            <Globe size={18} />
            Apple
          </button>
        </div>

        <p className="footer-text">
          Don't have an account? <Link to="/signup">Create one for free</Link>
        </p>

        <div className="trust-footer">
          <ShieldCheck size={14} /> 256-bit AES Encryption
        </div>
      </AuthCard>
    </Container>
  );
}

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.backgroundTertiary};
    padding: 24px;
`;

const AuthCard = styled.div`
    width: 100%;
    max-width: 440px;
    background: #fff;
    border-radius: 32px;
    padding: 48px;
    box-shadow: ${props => props.theme.shadows.md};
    border: 1px solid ${props => props.theme.border};

    .card-header {
        text-align: center;
        margin-bottom: 40px;
        .logo {
            width: 64px;
            height: 64px;
            background: ${props => props.theme.primary};
            color: #fff;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            box-shadow: 0 8px 16px ${props => props.theme.primary}40;
        }
        h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        p { color: ${props => props.theme.textSecondary}; font-weight: 500; }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .input-group {
            label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; color: ${props => props.theme.text}; }
            .label-row { display: flex; justify-content: space-between; align-items: center; }
            .forgot { border: none; background: transparent; color: ${props => props.theme.primary}; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
            
            .input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                
                svg:first-child { position: absolute; left: 16px; color: ${props => props.theme.textTertiary}; }
                
                input {
                    width: 100%;
                    padding: 16px 48px;
                    border-radius: 12px;
                    border: 1px solid ${props => props.theme.border};
                    font-size: 1rem;
                    font-weight: 600;
                    background: ${props => props.theme.backgroundTertiary}50;
                    outline: none;
                    transition: all 0.2s;
                    
                    &:focus { border-color: ${props => props.theme.primary}; background: #fff; box-shadow: 0 0 0 4px ${props => props.theme.primary}10; }
                }
                
                .toggle-pass {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: ${props => props.theme.textTertiary};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
            }
        }

        .submit-btn {
            background: ${props => props.theme.primary};
            color: #fff;
            border: none;
            padding: 18px;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.2s;
            box-shadow: 0 4px 12px ${props => props.theme.primary}30;
            
            &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px ${props => props.theme.primary}40; }
            &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        }
    }

    .divider {
        margin: 32px 0;
        position: relative;
        text-align: center;
        &::before { content: ''; position: absolute; inset: 50% 0 0; border-top: 1px solid ${props => props.theme.border}; }
        span { position: relative; background: #fff; padding: 0 16px; font-size: 0.85rem; font-weight: 700; color: ${props => props.theme.textTertiary}; text-transform: uppercase; letter-spacing: 0.5px; }
    }

    .social-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 32px;
        
        .social-btn {
            background: #fff;
            border: 1px solid ${props => props.theme.border};
            padding: 12px;
            border-radius: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s;
            
            img { width: 18px; }
            &:hover { background: ${props => props.theme.backgroundTertiary}; }
        }
    }

    .footer-text {
        text-align: center;
        color: ${props => props.theme.textSecondary};
        font-weight: 500;
        a { color: ${props => props.theme.primary}; font-weight: 700; text-decoration: none; }
    }

    .trust-footer {
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.75rem;
        color: ${props => props.theme.textTertiary};
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`;
