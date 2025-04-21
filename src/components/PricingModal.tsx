import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import RippleButton from './RippleButton';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(26, 26, 26, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(26, 26, 26, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(26, 26, 26, 0);
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
  }
`;

const ModalContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 32px 32px;
  border-radius: 24px;
  max-width: 1100px;
  width: 95%;
  position: relative;
  height: 85vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 24px 16px;
    justify-content: flex-start;
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 34px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    padding-top: 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }
`;

const ModalSubtitle = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0 auto;
  line-height: 1.4;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    white-space: normal;
    padding: 0 20px;
  }
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  position: relative;
  z-index: 1;
  flex: 1;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 4px 24px;
    -webkit-overflow-scrolling: touch;
    margin-top: 20px;
    height: auto;
  }
`;

const PlanCard = styled(motion.div)<{ isPopular?: boolean }>`
  background: ${props => props.isPopular ? 'linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)' : 'white'};
  padding: 20px;
  border-radius: 20px;
  box-shadow: ${props => props.isPopular ? '0 8px 24px rgba(255, 107, 0, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transform: ${props => props.isPopular ? 'scale(1.05)' : 'scale(1)'};
  transition: transform 0.3s ease;
  height: auto;

  &:hover {
    transform: ${props => props.isPopular ? 'scale(1.08)' : 'scale(1.03)'};
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 16px;
    min-height: 320px;
    justify-content: flex-start;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 24px;
  background: #1a1a1a;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: ${pulse} 2s infinite;
  cursor: pointer;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const PlanTitle = styled.h3<{ isPopular?: boolean }>`
  font-size: 1.5rem;
  color: ${props => props.isPopular ? 'white' : '#1a1a1a'};
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const PriceContainer = styled.div<{ isPopular?: boolean }>`
  margin: 8px 0;
  color: ${props => props.isPopular ? 'white' : 'inherit'};
`;

const OldPrice = styled.p<{ isPopular?: boolean }>`
  color: ${props => props.isPopular ? 'rgba(255, 255, 255, 0.8)' : '#666'};
  text-decoration: line-through;
  margin: 0;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CurrentPrice = styled.div<{ isPopular?: boolean }>`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${props => props.isPopular ? 'white' : '#1a1a1a'};
  display: flex;
  align-items: baseline;
  gap: 4px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PriceLabel = styled.p<{ isPopular?: boolean }>`
  color: ${props => props.isPopular ? 'rgba(255, 255, 255, 0.9)' : '#666'};
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

const Currency = styled.span`
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeatureList = styled.ul<{ isPopular?: boolean }>`
  list-style: none;
  padding: 0;
  margin: 8px 0;
  flex-grow: 1;
  color: ${props => props.isPopular ? 'white' : '#333'};

  @media (max-width: 768px) {
    margin: 12px 0;
  }
`;

const Feature = styled.li<{ isPopular?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
    padding-right: 8px;
  }

  &::before {
    content: "✓";
    color: ${props => props.isPopular ? 'white' : '#ff6b00'};
    font-weight: bold;
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const StyledRippleButton = styled(RippleButton)<{ isPopular?: boolean }>`
  width: 100%;
  height: 48px;
  font-size: 0.95rem;
  border-radius: 12px;
  
  ${props => props.isPopular && `
    background-color: white !important;
    color: #ff6b00 !important;

    &:hover {
      background-color: rgba(255, 255, 255, 0.9) !important;
    }
  `}
  
  @media (max-width: 768px) {
    font-size: 1rem;
    height: 56px;
  }
`;

const ConsultButtonWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  padding: 0 16px 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    font-size: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }
`;

interface Vehicle {
  id: number;
  nome: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: string;
  numericPrice?: number;
  quilometragem: string;
  cambio: string;
  combustivel: string;
  localizacao: string;
  imagem: string;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export default function PricingModal({ isOpen, onClose, vehicle }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>
            
            <ModalHeader>
              <ModalTitle>
                {vehicle ? `Consultar ${vehicle.marca} ${vehicle.modelo}` : 'Escolha o melhor plano para você'}
              </ModalTitle>
              <ModalSubtitle>
                Desbloqueie informações detalhadas e tome uma decisão segura na sua compra
              </ModalSubtitle>
            </ModalHeader>

            <PlansContainer>
              <PlanCard>
                <PlanTitle>Simples</PlanTitle>
                <PriceContainer>
                  <OldPrice>De R$ 9,90</OldPrice>
                  <PriceLabel>Por apenas</PriceLabel>
                  <CurrentPrice>
                    <Currency>R$</Currency>4,90
                  </CurrentPrice>
                </PriceContainer>
                <FeatureList>
                  <Feature>Nº do Chassi</Feature>
                  <Feature>Restrições</Feature>
                  <Feature>Consulta básica</Feature>
                </FeatureList>
                <ConsultButtonWrapper>
                  <StyledRippleButton variant="primary" fullWidth>Liberar Agora</StyledRippleButton>
                </ConsultButtonWrapper>
              </PlanCard>

              <PlanCard isPopular>
                <PopularBadge>Mais Popular</PopularBadge>
                <PlanTitle isPopular>Essencial</PlanTitle>
                <PriceContainer isPopular>
                  <OldPrice isPopular>De R$ 29,90</OldPrice>
                  <PriceLabel isPopular>Por apenas</PriceLabel>
                  <CurrentPrice isPopular>
                    <Currency>R$</Currency>24,90
                  </CurrentPrice>
                </PriceContainer>
                <FeatureList isPopular>
                  <Feature isPopular>Tudo do Simples</Feature>
                  <Feature isPopular>Renavam</Feature>
                  <Feature isPopular>Débitos e multas</Feature>
                  <Feature isPopular>Histórico completo</Feature>
                </FeatureList>
                <ConsultButtonWrapper>
                  <StyledRippleButton variant="primary" fullWidth isPopular>Liberar Agora</StyledRippleButton>
                </ConsultButtonWrapper>
              </PlanCard>

              <PlanCard>
                <PlanTitle>Completa</PlanTitle>
                <PriceContainer>
                  <OldPrice>De R$ 39,90</OldPrice>
                  <PriceLabel>Por apenas</PriceLabel>
                  <CurrentPrice>
                    <Currency>R$</Currency>34,90
                  </CurrentPrice>
                </PriceContainer>
                <FeatureList>
                  <Feature>Tudo do Essencial</Feature>
                  <Feature>Histórico de leilão</Feature>
                  <Feature>Perícia remota</Feature>
                  <Feature>Suporte prioritário</Feature>
                </FeatureList>
                <ConsultButtonWrapper>
                  <StyledRippleButton variant="primary" fullWidth>Liberar Agora</StyledRippleButton>
                </ConsultButtonWrapper>
              </PlanCard>
            </PlansContainer>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
} 