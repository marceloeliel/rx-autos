import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RippleButton from './RippleButton';
import { supabase } from '../lib/supabase/config';
import { useAuth } from '../lib/supabase/AuthContext';

const ProfileContainer = styled.div`
  min-height: calc(100vh - 72px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px 40px 40px 40px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  margin-top: 72px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 16px 24px 24px 24px;
    gap: 24px;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  height: fit-content;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.2);

  @media (max-width: 1024px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
`;

const Name = styled.h1`
  font-size: 20px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 24px 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  width: 100%;

  .profile-button {
    width: 100%;
    height: 44px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 24px;
    height: 24px;
    color: #ff6b00;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
`;

const FavoritesSection = styled.div`
  grid-column: 1 / -1;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CarCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const CarImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 140px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CarInfo = styled.div`
  padding: 12px;
`;

const CarName = styled.h3`
  font-size: 1rem;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CarPrice = styled.div`
  font-size: 1.1rem;
  color: #ff6b00;
  font-weight: 600;
  margin-bottom: 4px;
`;

const CarDetails = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #666;

  span {
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const EmptyFavorites = styled.div`
  text-align: center;
  padding: 32px 0;
  color: #666;

  svg {
    width: 40px;
    height: 40px;
    color: #ccc;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1.1rem;
    color: #333;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 0.9rem;
    margin: 0;
  }
`;

const RemoveButton = styled(RippleButton)`
  margin-top: 8px;
  width: 100%;
  height: 32px;
  font-size: 0.9rem;
`;

interface DadosUsuario {
  CEP: string;
  Telefone: string;
  DataNascimento: string;
  CPF: string;
  Logradouro: string;
  Estado: string;
  Bairro: string;
  numero: string;
  Cidade: string;
}

export default function UserProfile({ 
  onEditProfile, 
  onChangePassword,
  favoritos = [],
  onRemoveFavorito 
}: { 
  onEditProfile: () => void;
  onChangePassword: () => void;
  favoritos?: Array<{
    id: string;
    nome: string;
    preco: string;
    ano: string;
    quilometragem: string;
    imagem: string;
  }>;
  onRemoveFavorito?: (id: string) => void;
}) {
  const { user } = useAuth();
  const [dadosUsuario, setDadosUsuario] = useState<DadosUsuario | null>(null);

  useEffect(() => {
    async function carregarDadosUsuario() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('dados_usuario')
          .select('*')
          .eq('uid', user.id)
          .single();

        if (error) throw error;
        setDadosUsuario(data);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }

    carregarDadosUsuario();
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ProfileContainer>
      <Sidebar>
        <Avatar>
          {user?.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : '??'}
        </Avatar>
        <Name>{user?.user_metadata?.full_name || 'Usuário'}</Name>
        <Email>{user?.email}</Email>
        <ButtonsContainer>
          <RippleButton
            variant="secondary"
            className="profile-button"
            onClick={onEditProfile}
          >
            Dados do Perfil
          </RippleButton>
          <RippleButton
            variant="outline"
            className="profile-button"
            onClick={onChangePassword}
          >
            Alterar Senha
          </RippleButton>
        </ButtonsContainer>
      </Sidebar>

      <MainContent>
        <Card>
          <CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Informações Pessoais
          </CardTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{dadosUsuario?.Telefone || 'Não informado'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CPF</InfoLabel>
              <InfoValue>{dadosUsuario?.CPF || 'Não informado'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Data de Nascimento</InfoLabel>
              <InfoValue>{dadosUsuario?.DataNascimento || 'Não informado'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Card>

        <Card>
          <CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            Endereço
          </CardTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Logradouro</InfoLabel>
              <InfoValue>{`${dadosUsuario?.Logradouro}, ${dadosUsuario?.numero}` || 'Não informado'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Bairro</InfoLabel>
              <InfoValue>{dadosUsuario?.Bairro || 'Não informado'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Cidade/Estado</InfoLabel>
              <InfoValue>{`${dadosUsuario?.Cidade}/${dadosUsuario?.Estado}` || 'Não informado'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CEP</InfoLabel>
              <InfoValue>{dadosUsuario?.CEP || 'Não informado'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Card>

        {favoritos && favoritos.length > 0 && (
          <FavoritesSection>
            <CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Veículos Favoritos
            </CardTitle>
            <FavoritesGrid>
              {favoritos.map(carro => (
                <CarCard key={carro.id}>
                  <CarImage imageUrl={carro.imagem}>
                  </CarImage>
                  <CarInfo>
                    <CarName>{carro.nome}</CarName>
                    <CarPrice>{carro.preco}</CarPrice>
                    <CarDetails>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                          <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                        {carro.ano}
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                        {carro.quilometragem}
                      </span>
                    </CarDetails>
                    {onRemoveFavorito && (
                      <RemoveButton
                        variant="outline"
                        onClick={() => onRemoveFavorito(carro.id)}
                      >
                        Remover dos Favoritos
                      </RemoveButton>
                    )}
                  </CarInfo>
                </CarCard>
              ))}
            </FavoritesGrid>
          </FavoritesSection>
        )}

        {(!favoritos || favoritos.length === 0) && (
          <FavoritesSection>
            <CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Veículos Favoritos
            </CardTitle>
            <EmptyFavorites>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <h3>Nenhum veículo favorito</h3>
              <p>Você ainda não adicionou nenhum veículo aos favoritos</p>
            </EmptyFavorites>
          </FavoritesSection>
        )}
      </MainContent>
    </ProfileContainer>
  );
} 