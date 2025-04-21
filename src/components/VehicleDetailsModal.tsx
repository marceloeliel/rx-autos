import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import RippleButton from './RippleButton';
import locationPin from '../assets/icons/pin-de-localizacao.png';

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
  }
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;

  @media (max-width: 768px) {
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 300px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    height: 240px;
    padding: 24px;
  }
`;

const Content = styled.div`
  padding: 32px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Price = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff6b00;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;

  strong {
    font-size: 0.9rem;
    color: #666;
    min-width: 120px;
  }

  span {
    font-size: 1rem;
    color: #333;
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    font-size: 1rem;
    color: #333;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  .modal-button {
    flex: 1;
    height: 48px;
    font-size: 1rem;
  }

  .whatsapp-button {
    background-color: #25D366;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
      background-color: #22c15e;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;

    .modal-button {
      height: 52px;
    }
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

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConsultClick: (vehicle: Vehicle) => void;
}

export default function VehicleDetailsModal({ isOpen, onClose, vehicle, onConsultClick }: VehicleDetailsModalProps) {
  if (!isOpen || !vehicle) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>&times;</CloseButton>
          
          <ImageContainer>
            <img src={vehicle.imagem} alt={vehicle.nome} />
          </ImageContainer>

          <Content>
            <Header>
              <Title>{vehicle.nome}</Title>
              <Price>{vehicle.preco}</Price>
            </Header>

            <DetailsGrid>
              <DetailItem>
                <strong>Marca:</strong>
                <span>{vehicle.marca}</span>
              </DetailItem>
              <DetailItem>
                <strong>Modelo:</strong>
                <span>{vehicle.modelo}</span>
              </DetailItem>
              <DetailItem>
                <strong>Ano:</strong>
                <span>{vehicle.ano}</span>
              </DetailItem>
              <DetailItem>
                <strong>Quilometragem:</strong>
                <span>{vehicle.quilometragem}</span>
              </DetailItem>
              <DetailItem>
                <strong>Câmbio:</strong>
                <span>{vehicle.cambio}</span>
              </DetailItem>
              <DetailItem>
                <strong>Combustível:</strong>
                <span>{vehicle.combustivel}</span>
              </DetailItem>
            </DetailsGrid>

            <LocationContainer>
              <img src={locationPin} alt="Localização" />
              <span>{vehicle.localizacao}</span>
            </LocationContainer>

            <ButtonsContainer>
              <RippleButton
                variant="secondary"
                className="modal-button"
                onClick={() => onConsultClick(vehicle)}
              >
                Consultar
              </RippleButton>
              <RippleButton
                variant="primary"
                className="modal-button whatsapp-button"
                onClick={() => {
                  const message = `Olá! Vi o ${vehicle.nome} (${vehicle.ano}) no valor de ${vehicle.preco} e gostaria de mais informações.`;
                  window.open(`https://wa.me/5561999999999?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
                </svg>
                Contatar vendedor
              </RippleButton>
            </ButtonsContainer>
          </Content>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
} 