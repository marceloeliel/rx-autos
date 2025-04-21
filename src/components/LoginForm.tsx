import React, { useState } from 'react';
import styled from 'styled-components';
import RippleButton from './RippleButton';
import { useAuth } from '../lib/supabase/AuthContext';
import LoginSuccessModal from './LoginSuccessModal';

const FormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 0;
    background-color: white;
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;

  /* Estilizando a scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #bbb;
  }

  .submit-button {
    width: 100%;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 32px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 32px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #666;
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: ${props => props.type === 'password' ? '46px' : '16px'};
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ddd;
    background-color: #fafafa;
  }

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
  display: block;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }

  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #333333;
  font-size: 0.9rem;
  padding: 0;
  cursor: pointer;
  margin-top: 8px;
  text-align: right;
  width: 100%;

  &:hover {
    text-decoration: underline;
    color: #666666;
  }
`;

const SignUpLink = styled.button`
  background: none;
  border: none;
  color: #333333;
  font-size: 0.9rem;
  padding: 0;
  cursor: pointer;
  margin-top: 16px;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
    color: #666666;
  }

  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

export default function LoginForm({ isOpen, onClose, onSignUpClick }: LoginFormProps) {
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    senha: '',
    geral: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        geral: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      senha: '',
      geral: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { error } = await signIn(formData.email, formData.senha);
        
        if (error) {
          setErrors(prev => ({
            ...prev,
            geral: 'Email ou senha incorretos'
          }));
        } else {
          setShowSuccess(true);
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          geral: 'Erro ao fazer login. Tente novamente.'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors(prev => ({
        ...prev,
        email: 'Digite seu email para recuperar a senha'
      }));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(formData.email);
      
      if (error) {
        setErrors(prev => ({
          ...prev,
          geral: 'Erro ao enviar email de recuperação'
        }));
      } else {
        alert('Email de recuperação enviado com sucesso!');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        geral: 'Erro ao enviar email de recuperação'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onClose();
  };

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      )}
    </svg>
  );

  if (!isOpen) return null;

  if (showSuccess) {
    return <LoginSuccessModal onComplete={handleSuccessComplete} />;
  }

  return (
    <FormContainer onClick={onClose}>
      <Form onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Entrar</Title>

        {errors.geral && <ErrorMessage style={{ textAlign: 'center', marginBottom: '16px' }}>{errors.geral}</ErrorMessage>}

        <InputContainer>
          <Label htmlFor="email">E-mail</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu e-mail"
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor="senha">Senha</Label>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <EyeIcon open={!showPassword} />
            </TogglePasswordButton>
          </InputWrapper>
          {errors.senha && <ErrorMessage>{errors.senha}</ErrorMessage>}
          <ForgotPassword onClick={handleForgotPassword}>
            Esqueceu sua senha?
          </ForgotPassword>
        </InputContainer>

        <RippleButton
          variant="primary"
          onClick={handleSubmit}
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </RippleButton>

        <SignUpLink onClick={onSignUpClick}>
          Não tem uma conta? Cadastre-se na RX Autos
        </SignUpLink>
      </Form>
    </FormContainer>
  );
} 