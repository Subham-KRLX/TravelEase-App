import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plane,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { theme } = useTheme();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signup(name, email, password);
      if (result.success) navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
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
          <h1>Create Account</h1>
          <p>Join TravelEase and start your next adventure</p>
        </div>

        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
            <label>Password</label>
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

          <PasswordList>
            <li className="active"><CheckCircle2 size={12} /> At least 8 characters</li>
            <li><CheckCircle2 size={12} /> One special character</li>
          </PasswordList>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={20} />
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Sign In instead</Link>
        </p>

        <div className="trust-footer">
          <ShieldCheck size={14} /> SECURE CLOUD STORAGE
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
            background: #10B981;
            color: #fff;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            box-shadow: 0 8px 16px #10B98140;
        }
        h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        p { color: ${props => props.theme.textSecondary}; font-weight: 500; }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .input-group {
            label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; color: ${props => props.theme.text}; }
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
                    outline: none;
                    &:focus { border-color: #10B981; box-shadow: 0 0 0 4px #10B98110; }
                }
                .toggle-pass {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: ${props => props.theme.textTertiary};
                    cursor: pointer;
                }
            }
        }

        .submit-btn {
            background: #10B981;
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
            margin-top: 12px;
            box-shadow: 0 4px 12px #10B98130;
            &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px #10B98140; }
        }
    }

    .footer-text {
        text-align: center;
        margin-top: 32px;
        color: ${props => props.theme.textSecondary};
        font-weight: 500;
        a { color: #10B981; font-weight: 700; text-decoration: none; }
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
    }
`;

const PasswordList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 8px 0;
    li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        font-weight: 600;
        color: ${props => props.theme.textTertiary};
        margin-bottom: 4px;
        svg { color: ${props => props.theme.border}; }
        &.active {
            color: #10B981;
            svg { color: #10B981; }
        }
    }
`;
