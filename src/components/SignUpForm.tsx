import React, { useState } from 'react';
import styled from 'styled-components';
import RippleButton from './RippleButton';
import { useAuth } from '../lib/supabase/AuthContext';
import SignUpSuccessModal from './SignUpSuccessModal';
import EmailExistsModal from './EmailExistsModal';

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
    margin-top: 12px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 12px;
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

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  padding-right: ${props => props.type === 'password' ? '46px' : '16px'};
  border: 2px solid ${props => props.hasError ? '#e74c3c' : '#eee'};
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.hasError ? '#e74c3c' : '#ddd'};
    background-color: #fafafa;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : '#ff6b00'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 107, 0, 0.1)'};
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
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #333333;
  font-size: 0.9rem;
  padding: 0;
  cursor: pointer;
  margin-top: 12px;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
    color: #666666;
  }

  @media (max-width: 768px) {
    margin-top: auto;
    padding-bottom: 20px;
  }
`;

const PasswordStrengthIndicator = styled.div`
  margin-top: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #eee;
  overflow: hidden;
`;

const StrengthBar = styled.div<{ strength: number }>`
  height: 100%;
  width: ${props => props.strength * 25}%;
  background-color: ${props => {
    if (props.strength <= 1) return '#e74c3c';
    if (props.strength === 2) return '#f1c40f';
    if (props.strength === 3) return '#2ecc71';
    return '#27ae60';
  }};
  transition: all 0.3s ease;
`;

const StrengthText = styled.span<{ strength: number }>`
  font-size: 0.8rem;
  color: ${props => {
    if (props.strength <= 1) return '#e74c3c';
    if (props.strength === 2) return '#f1c40f';
    if (props.strength === 3) return '#2ecc71';
    return '#27ae60';
  }};
  margin-top: 4px;
  display: block;
`;

interface SignUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

interface FormErrors {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  geral: string;
}

export default function SignUpForm({ isOpen, onClose, onLoginClick }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    geral: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailExists, setShowEmailExists] = useState(false);
  const { signUp } = useAuth();

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return 'Muito fraca';
    if (strength === 1) return 'Fraca';
    if (strength === 2) return 'Média';
    if (strength === 3) return 'Forte';
    return 'Muito forte';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Atualiza a força da senha quando o campo senha é alterado
    if (name === 'senha') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Limpa os erros quando o usuário começa a digitar
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
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      geral: ''
    };

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação melhorada da senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
    } else if (passwordStrength < 2) {
      newErrors.senha = 'Senha muito fraca. Inclua letras maiúsculas, números e símbolos.';
    }

    // Validação da confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const signUpResult = await signUp(
          formData.email,
          formData.senha,
          {
            full_name: formData.nome
          }
        );

        if (signUpResult.error) {
          // Se o erro contém a palavra "email" ou "já cadastrado"
          if (signUpResult.error.toLowerCase().includes('email') || 
              signUpResult.error.toLowerCase().includes('cadastrado')) {
            setShowEmailExists(true);
            return;
          }

          // Outros tipos de erro
          setErrors({
            ...errors,
            geral: signUpResult.error
          });
          return;
        }

        // Cadastro bem sucedido
        setShowSuccess(true);
      } catch (error) {
        setErrors({
          ...errors,
          geral: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
        });
      } finally {
        setIsLoading(false);
      }
    }
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

  return (
    <>
      <FormContainer onClick={onClose}>
        <Form onClick={e => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>Criar conta</Title>

          {errors.geral && (
            <ErrorMessage style={{ 
              textAlign: 'center', 
              marginBottom: '16px',
              padding: '10px',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderRadius: '8px'
            }}>
              {errors.geral}
            </ErrorMessage>
          )}

          <InputContainer>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              hasError={!!errors.nome}
            />
            {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              hasError={!!errors.email}
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
                hasError={!!errors.senha}
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <EyeIcon open={!showPassword} />
              </TogglePasswordButton>
            </InputWrapper>
            {formData.senha && (
              <>
                <PasswordStrengthIndicator>
                  <StrengthBar strength={passwordStrength} />
                </PasswordStrengthIndicator>
                <StrengthText strength={passwordStrength}>
                  Força da senha: {getStrengthText(passwordStrength)}
                </StrengthText>
              </>
            )}
            {errors.senha && <ErrorMessage>{errors.senha}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                hasError={!!errors.confirmarSenha}
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <EyeIcon open={!showConfirmPassword} />
              </TogglePasswordButton>
            </InputWrapper>
            {errors.confirmarSenha && <ErrorMessage>{errors.confirmarSenha}</ErrorMessage>}
          </InputContainer>

          <RippleButton
            variant="primary"
            onClick={handleSubmit}
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </RippleButton>

          <LoginLink onClick={onLoginClick}>
            Já tem conta na RX Autos? Clique aqui
          </LoginLink>
        </Form>
      </FormContainer>

      {showSuccess && (
        <SignUpSuccessModal
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}

      {showEmailExists && (
        <EmailExistsModal
          onClose={() => {
            setShowEmailExists(false);
            onClose();
          }}
          onLoginClick={() => {
            setShowEmailExists(false);
            onLoginClick();
          }}
        />
      )}
    </>
  );
} 