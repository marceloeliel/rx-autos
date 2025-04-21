import React from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  padding: 20px;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ContentContainer = styled.div`
  text-align: center;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #27ae60;
  margin: 20px 0;
  font-weight: bold;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 30px;
`;

const AnimationContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

interface SignUpSuccessModalProps {
  onClose: () => void;
}

export default function SignUpSuccessModal({ onClose }: SignUpSuccessModalProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Fecha automaticamente após 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ModalContainer>
      <ContentContainer>
        <AnimationContainer>
          <DotLottieReact
            src="https://lottie.host/655b152a-0462-4903-89c5-5a2691b0dcb3/fXCM8vr3Pw.lottie"
            loop
            autoplay
          />
        </AnimationContainer>
        <Title>Bem-vindo à RX Autos!</Title>
        <Message>
          Seu cadastro foi realizado com sucesso! 🎉<br />
          Enviamos um email de confirmação para você.<br />
          Verifique sua caixa de entrada para ativar sua conta.
        </Message>
      </ContentContainer>
    </ModalContainer>
  );
} 