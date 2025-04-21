import React from 'react';
import styled from 'styled-components';
import { DotLottiePlayer } from '@dotlottie/react-player';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const ContentContainer = styled.div`
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  max-width: 320px;
`;

const AnimationContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const Message = styled.p`
  color: #2ecc71;
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 20px;
`;

interface LoginSuccessModalProps {
  onComplete: () => void;
}

export default function LoginSuccessModal({ onComplete }: LoginSuccessModalProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <ModalContainer>
      <ContentContainer>
        <AnimationContainer>
          <DotLottiePlayer
            src="https://lottie.host/f0ad7819-f227-470f-97fe-eaa6196d42d3/NE4gRCb1jx.lottie"
            autoplay
            loop={false}
          />
        </AnimationContainer>
        <Message>Login realizado com sucesso!</Message>
      </ContentContainer>
    </ModalContainer>
  );
} 