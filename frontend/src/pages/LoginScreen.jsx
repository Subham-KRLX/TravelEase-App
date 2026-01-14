import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { IoAirplane, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoLogoGoogle } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, googleLogin } = useAuth(); // Assuming googleLogin is available in AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      console.log('Login result in screen:', result);

      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error || 'Please check your credentials');
      }
    } catch (error) {
      alert('An unexpected error occurred during login');
      console.error('Login Screen Error:', error);
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
            <Title>Welcome Back!</Title>
            <Subtitle>Login to continue your journey</Subtitle>
          </Header>

          <Form onSubmit={handleLogin}>
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

            <ForgotPasswordButton type="button">
              Forgot Password?
            </ForgotPasswordButton>

            <LoginButton type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </LoginButton>

            <GoogleButton type="button" onClick={async () => {
              setLoading(true);
              await googleLogin();
              // Logic for google login result handling
              setLoading(false);
            }} disabled={loading}>
              <IoLogoGoogle size={20} color="#ea4335" />
              <GoogleButtonText>Continue with Google</GoogleButtonText>
            </GoogleButton>

            <Divider>
              <DividerLine />
              <DividerText>OR</DividerText>
              <DividerLine />
            </Divider>

            <SignupLinkContainer>
              <SignupText>
                Don't have an account? <StyledLink to="/signup">Sign Up</StyledLink>
              </SignupText>
            </SignupLinkContainer>
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

const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  color: #1e40af;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-end;
  padding: 0;
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  background-color: #1e40af;
  color: white;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e3a8a;
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled.button`
  background-color: white;
  color: #1e293b;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const GoogleButtonText = styled.span``;

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

const SignupLinkContainer = styled.div`
  text-align: center;
`;

const SignupText = styled.p`
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
