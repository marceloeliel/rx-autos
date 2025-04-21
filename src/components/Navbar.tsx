import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import RippleButton from './RippleButton';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import { useAuth } from '../lib/supabase/AuthContext';
import { toast } from 'react-toastify';

interface NavLinksProps {
  isOpen: boolean;
}

const Nav = styled.nav`
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  height: 40px;
`;

const NavLinks = styled.div<NavLinksProps>`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #ff6b00;
  }

  @media (max-width: 768px) {
    padding: 15px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavItem = styled.div`
  cursor: pointer;
`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleInicioClick = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsSignUpOpen(false);
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
    setIsLoginOpen(false);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Erro ao sair. Tente novamente.');
        return;
      }
      toast.success('Você saiu com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao sair. Tente novamente.');
    }
  };

  return (
    <>
      <Nav>
        <LogoContainer>
          <LogoImg src={logo} alt="RX Automóveis" />
        </LogoContainer>
        
        <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
          ☰
        </MobileMenuButton>

        <NavLinks isOpen={isOpen}>
          <NavLink to="/" onClick={handleInicioClick}>Início</NavLink>
          <NavLink to="/pesquisa">Pesquisar veículos</NavLink>
          <NavLink to="/adm">Painel</NavLink>
          <NavLink to="/registro">Agência de registro</NavLink>
          <NavLink to="/perfil">Meu Perfil</NavLink>
          <ButtonContainer>
            {user ? (
              <>
                <NavItem onClick={handleLogout}>Sair</NavItem>
              </>
            ) : (
              <>
                <RippleButton 
                  variant="outline"
                  onClick={handleLoginClick}
                >
                  Entrar
                </RippleButton>
                <RippleButton 
                  variant="primary"
                  onClick={handleSignUpClick}
                >
                  Cadastre-se
                </RippleButton>
              </>
            )}
          </ButtonContainer>
        </NavLinks>
      </Nav>

      <LoginForm 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />

      <SignUpForm 
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onLoginClick={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
} 