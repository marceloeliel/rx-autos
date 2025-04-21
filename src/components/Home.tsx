import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Footer from './Footer';
import VehicleList from './VehicleList';
import backgroundImage from '../assets/background.jpg';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;

const HeroSection = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding: 0 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    opacity: 0;
    animation: fadeIn 1s ease-in-out forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 0 20px;
    justify-content: center;
    min-height: 100vh;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  max-width: 700px;
  text-align: left;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    padding: 0;
    max-width: 100%;
    line-height: 1.3;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 16px;
    margin-top: 20px;
    align-items: stretch;
    padding: 0 16px;
  }
`;

const SearchFieldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;

    select, input {
      width: 100%;
      height: 50px;
      font-size: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #ddd;
      background-color: white;
      appearance: auto;
      color: #333;
      
      &::placeholder {
        color: #666;
      }

      &:focus {
        outline: none;
        border-color: #ff6b00;
        box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
      }
    }
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.4rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 2rem;
  line-height: 1.5;
  max-width: 600px;
  opacity: 0.9;
  text-align: left;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    padding: 0;
    line-height: 1.4;
  }
`;

const SearchButton = styled(motion.button)`
  background-color: #ff6b00;
  color: white;
  padding: 16px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
  width: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff8533;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
    font-size: 1.1rem;
    margin-top: 12px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default function Home() {
  const vehicleListRef = useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    vehicleListRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <Title
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Encontre o seu veículo perfeito na RX Autos
        </Title>
        <Subtitle
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Navegue por milhares de veículos de qualidade de agências confiáveis ​​em todo o país.
        </Subtitle>
        <SearchButton
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={handleSearchClick}
        >
          Buscar Veículos
        </SearchButton>
      </HeroSection>
      <div ref={vehicleListRef}>
        <VehicleList />
      </div>
      <Footer />
    </HomeContainer>
  );
} 