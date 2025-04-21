import React from 'react';
import styled from 'styled-components';
import { DotLottiePlayer } from '@dotlottie/react-player';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  padding: 20px;
`;

const ContentContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const AnimationContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 24px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #e74c3c;
  margin-bottom: 16px;
`;

const Message = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

interface EmailExistsModalProps {
  onClose: () => void;
  onLoginClick: () => void;
}

export default function EmailExistsModal({ onClose, onLoginClick }: EmailExistsModalProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Fecha automaticamente após 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  return (
    <ModalContainer>
      <ContentContainer>
        <AnimationContainer>
          <DotLottiePlayer
            src="https://lottie.host/2b2d8c6c-c3f0-4080-9c9a-42d5b7518cb9/gTDGd5hPVt.lottie"
            autoplay
            loop
          />
        </AnimationContainer>
        <Title>Email já cadastrado!</Title>
        <Message>
          Este email já está registrado no sistema.<br />
          Por favor, faça login com suas credenciais ou use outro email.
        </Message>
        <Button onClick={handleLoginClick}>
          Fazer Login
        </Button>
      </ContentContainer>
    </ModalContainer>
  );
} 