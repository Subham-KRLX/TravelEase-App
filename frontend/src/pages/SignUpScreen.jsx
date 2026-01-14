import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { IoAirplane, IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth(); // Assuming signup is available in AuthContext

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name, email, password);
      console.log('Signup screen result:', result);

      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error || 'Please check your details and try again.');
      }
    } catch (error) {
      console.error('Signup screen catch block:', error);
      alert('An unexpected error occurred during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <FormCard>
          <Header>
            <IoAirplane size={48} color="#1e40af" />
            <Title>Create Account</Title>
            <Subtitle>Join TravelEase today</Subtitle>
          </Header>

          <Form onSubmit={handleSignUp}>
            <InputGroup>
              <InputIcon>
                <IoPersonOutline size={20} color="#64748b" />
              </InputIcon>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <IoMailOutline size={20} color="#64748b" />
              </InputIcon>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <IoLockClosedOutline size={20} color="#64748b" />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoEyeOffOutline size={20} color="#64748b" /> : <IoEyeOutline size={20} color="#64748b" />}
              </EyeButton>
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <IoLockClosedOutline size={20} color="#64748b" />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InputGroup>

            <SignUpButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </SignUpButton>

            <Divider>
              <DividerLine />
              <DividerText>OR</DividerText>
              <DividerLine />
            </Divider>

            <LoginLinkContainer>
              <LoginText>
                Already have an account? <StyledLink to="/login">Login</StyledLink>
              </LoginText>
            </LoginLinkContainer>
          </Form>
        </FormCard>
      </Content>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 24px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1e293b;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  pointer-events: none;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #1e293b;
  background-color: #f8fafc;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #1e40af;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const SignUpButton = styled.button`
  background-color: #1e40af;
  color: white;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #1e3a8a;
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
`;

const DividerText = styled.span`
  margin: 0 16px;
  color: #64748b;
  font-size: 14px;
`;

const LoginLinkContainer = styled.div`
  text-align: center;
`;

const LoginText = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: #1e40af;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;
