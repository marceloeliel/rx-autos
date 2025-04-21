import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  width: 45%;
  min-width: 380px;
  max-width: 720px;
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    min-width: unset;
    border-radius: 12px 12px 0 0;
    max-width: 100%;
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Icon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #ff6b00;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const TitleContainer = styled.div`
  min-width: 0;
  flex: 1;
  margin-right: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Description = styled.p`
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin: 2px 0 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  min-width: 80px;
  padding: 0 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.primary ? `
    background-color: #ff6b00;
    color: white;

    &:hover {
      background-color: #ff8533;
    }
  ` : `
    background-color: #f5f5f5;
    color: #333;

    &:hover {
      background-color: #e5e5e5;
    }
  `}

  @media (max-width: 768px) {
    min-width: 75px;
    padding: 0 14px;
    height: 32px;
  }

  @media (max-width: 480px) {
    flex: 1;
    height: 38px;
    font-size: 0.9rem;
  }
`;

const InstallPWAPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      console.log('beforeinstallprompt event detected');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Verifica se o app já está instalado
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App já está instalado');
        setIsVisible(false);
        return true;
      }
      return false;
    };

    // Se não estiver instalado, adiciona o listener
    if (!checkInstalled()) {
      console.log('Adicionando listener para beforeinstallprompt');
      window.addEventListener('beforeinstallprompt', handler);
    }

    // Listener para quando o app for instalado
    window.addEventListener('appinstalled', (e) => {
      console.log('App instalado com sucesso');
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      console.log('Iniciando instalação');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    console.log('Prompt de instalação descartado pelo usuário');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <NotificationContainer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <Content>
          <TextContent>
            <Icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </Icon>
            <TitleContainer>
              <Title>Instalar RX Autos</Title>
              <Description>
                Encontre o seu veículo perfeito na RX Autos
              </Description>
            </TitleContainer>
          </TextContent>
          <ButtonsContainer>
            <Button onClick={handleDismiss}>Agora não</Button>
            <Button primary onClick={handleInstall}>
              Instalar
            </Button>
          </ButtonsContainer>
        </Content>
      </NotificationContainer>
    </AnimatePresence>
  );
};

export default InstallPWAPrompt; 