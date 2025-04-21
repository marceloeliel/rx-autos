import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #fff;
  padding: 60px 50px;
  margin-top: 0;
  border-top: 1px solid #eee;
`;

const FooterContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  max-width: 300px;
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const LinkItem = styled.li`
  margin-bottom: 12px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b00;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 20px;
  color: #666;
  font-size: 1rem;
  text-align: center;
  width: 100%;
`;

const Copyright = styled.div`
  text-align: center;
  color: #666;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Column>
          <Title>RX Negocio</Title>
          <Description>
            O principal marketplace online para compra e venda de veículos. Conecte-se com agências confiáveis e encontre o veículo perfeito.
          </Description>
        </Column>

        <Column>
          <Title>Links rápidos</Title>
          <LinksList>
            <LinkItem>
              <StyledLink to="/">Home</StyledLink>
            </LinkItem>
            <LinkItem>
              <StyledLink to="/veiculos">Veículos</StyledLink>
            </LinkItem>
            <LinkItem>
              <StyledLink to="/sobre">Sobre</StyledLink>
            </LinkItem>
            <LinkItem>
              <StyledLink to="/contato">Contato</StyledLink>
            </LinkItem>
          </LinksList>
        </Column>

        <Column>
          <Title>Contate-nos</Title>
          <ContactInfo>
            Email: contato@rxnegocio.com.br
          </ContactInfo>
          <ContactInfo>
            Telefone: (11) 99999-9999
          </ContactInfo>
        </Column>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} RX Negocio. Todos os direitos reservados.
      </Copyright>
    </FooterContainer>
  );
} 