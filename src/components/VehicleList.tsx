import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import bmwIX1 from '../assets/bmw-iX1.png';
import PricingModal from './PricingModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import locationPin from '../assets/icons/pin-de-localizacao.png';
import RippleButton from './RippleButton';
import { useSearchParams } from 'react-router-dom';

interface ContainerProps {
  isSecond?: boolean;
}

interface TitleProps {
  center?: boolean;
}

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

const Container = styled.div<ContainerProps>`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: ${props => props.isSecond ? '0' : '80px'};
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px 16px;
    margin-top: ${props => props.isSecond ? '0' : '40px'};
  }
`;

const Title = styled.h2<TitleProps>`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: ${props => props.center ? 'center' : 'left'};
`;

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 24px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  height: 50px;
  color: #666;
`;

const LocationIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
`;

const LocationText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #333;
  appearance: auto;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0 16px;
  width: 100%;
  height: 50px;

  &:focus-within {
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
  }
`;

const CurrencyPrefix = styled.span`
  color: #666;
  margin-right: 8px;
  font-size: 16px;
`;

const PriceInput = styled.input`
  border: none;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #333;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #666;
  }
`;

const StyledButton = styled(RippleButton)`
  &.search-button, &.clear-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.clear-button {
    border: 1px solid #ddd;
    background: transparent;
    color: #666;

    &:hover {
      background: #f5f5f5;
    }
  }

  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const VehiclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 12px;
    gap: 20px;
  }
`;

const VehicleCard = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: white;
  width: 100%;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const VehicleContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`;

const VehicleName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff6b00;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const VehicleImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
`;

const VehicleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 8px 0;
`;

const DetailItem = styled.div`
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: #333;
    font-weight: 600;
    min-width: 100px;
  }
`;

const LocationDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #666;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #eee;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;

  .vehicle-button {
  flex: 1;
    height: 42px;
    font-size: 0.95rem;
  }

  .vehicle-button[variant="outline"] {
    border: 2px solid #eee;
    color: #666;

  &:hover {
      background-color: #333333 !important;
      border-color: #333333 !important;
      color: white !important;
    }
  }

  @media (max-width: 768px) {
    .vehicle-button {
      height: 46px;
      font-size: 1rem;
    }
  }
`;

export default function VehicleList() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [location, setLocation] = useState('Brasília DF');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [priceValue, setPriceValue] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const vehiclesRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams()[0];
  const [sortBy, setSortBy] = useState<string>('nome');

  const vehicles = useMemo<Vehicle[]>(() => [
    {
      id: 1,
      nome: 'BMW iX1',
      marca: 'BMW',
      modelo: 'iX1',
      ano: 2024,
      preco: 'R$ 429.950',
      numericPrice: 429950,
      quilometragem: '0 km',
      cambio: 'Automático',
      combustivel: 'Elétrico',
      localizacao: 'São Paulo, SP',
      imagem: bmwIX1
    },
    {
      id: 2,
      nome: 'Toyota Camry',
      marca: 'Toyota',
      modelo: 'Camry',
      ano: 2023,
      preco: 'R$ 289.990',
      numericPrice: 289990,
      quilometragem: '15.000 km',
      cambio: 'Automático',
      combustivel: 'Híbrido',
      localizacao: 'Rio de Janeiro, RJ',
      imagem: bmwIX1
    },
    {
      id: 3,
      nome: 'Honda Civic',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2023,
      preco: 'R$ 244.900',
      numericPrice: 244900,
      quilometragem: '0 km',
      cambio: 'Automático',
      combustivel: 'Flex',
      localizacao: 'Brasília, DF',
      imagem: bmwIX1
    },
    {
      id: 4,
      nome: 'Volkswagen Golf GTI',
      marca: 'Volkswagen',
      modelo: 'Golf GTI',
      ano: 2024,
      preco: 'R$ 349.990',
      numericPrice: 349990,
      quilometragem: '0 km',
      cambio: 'Automático',
      combustivel: 'Gasolina',
      localizacao: 'Curitiba, PR',
      imagem: bmwIX1
    },
    {
      id: 5,
      nome: 'Mercedes-Benz C300',
      marca: 'Mercedes-Benz',
      modelo: 'C300',
      ano: 2024,
      preco: 'R$ 399.900',
      numericPrice: 399900,
      quilometragem: '5.000 km',
      cambio: 'Automático',
      combustivel: 'Gasolina',
      localizacao: 'Belo Horizonte, MG',
      imagem: bmwIX1
    },
    {
      id: 6,
      nome: 'Audi Q3',
      marca: 'Audi',
      modelo: 'Q3',
      ano: 2024,
      preco: 'R$ 379.990',
      numericPrice: 379990,
      quilometragem: '0 km',
      cambio: 'Automático',
      combustivel: 'Gasolina',
      localizacao: 'Porto Alegre, RS',
      imagem: bmwIX1
    }
  ], []);

  const formatPrice = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers) {
      const numberValue = parseInt(numbers);
      return new Intl.NumberFormat('pt-BR').format(numberValue);
    }
    
    return '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceValue(formatPrice(value));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleSearch = () => {
    let filtered = [...vehicles];

    if (selectedBrand) {
      filtered = filtered.filter(vehicle => 
        vehicle.marca.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (priceValue) {
      const maxPrice = parseInt(priceValue.replace(/\D/g, ''));
      filtered = filtered.filter(vehicle => 
        vehicle.numericPrice ? vehicle.numericPrice <= maxPrice : true
      );
    }

    setFilteredVehicles(filtered);

    vehiclesRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleClear = () => {
    setPriceValue('');
    setSelectedBrand('');
    setFilteredVehicles(vehicles);
  };

  const handleConsultClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsPricingModalOpen(true);
  };

  const handleDetailsClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleSort = (vehicles: Vehicle[]) => {
    return [...vehicles].sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'marca':
          return a.marca.localeCompare(b.marca);
        case 'modelo':
          return a.modelo.localeCompare(b.modelo);
        case 'ano':
          return Number(a.ano) - Number(b.ano);
        case 'preco':
          return Number(a.preco) - Number(b.preco);
        case 'localizacao':
          return a.localizacao.localeCompare(b.localizacao);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    if (searchParams.get("marca")) {
      const filteredResults = vehicles.filter(
        (vehicle) =>
          vehicle.marca.toLowerCase() === searchParams.get("marca")?.toLowerCase()
      );
      setFilteredVehicles(filteredResults);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchParams, vehicles]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state;
            if (city && state) {
              // Verifica se é Distrito Federal e formata adequadamente
              const stateAbbr = state.toLowerCase().includes('distrito federal') ? 'DF' : state.substring(0, 2).toUpperCase();
              setLocation(`${city} ${stateAbbr}`);
            }
          }
        } catch (error) {
          console.error('Erro ao obter localização:', error);
        } finally {
          setIsLoadingLocation(false);
        }
      }, (error) => {
        console.error('Erro na geolocalização:', error);
        setIsLoadingLocation(false);
      });
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Container>
        <Title center>Encontre o seu veículo perfeito na RX Autos</Title>
        <SearchContainer>
          <LocationContainer>
            <LocationIcon src={locationPin} alt="Localização" />
            <LocationText>
              {isLoadingLocation ? 'Obtendo localização...' : location}
            </LocationText>
          </LocationContainer>
          <Select 
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="">Todas as marcas</option>
            <option value="toyota">Toyota</option>
            <option value="ford">Ford</option>
            <option value="honda">Honda</option>
            <option value="chevrolet">Chevrolet</option>
            <option value="bmw">BMW</option>
          </Select>
          <InputContainer>
            <PriceInput
              type="text"
              placeholder="Valor máximo"
              value={priceValue}
              onChange={handlePriceChange}
            />
          </InputContainer>
          <StyledButton 
            variant="primary" 
            className="search-button"
            onClick={handleSearch}
          >
            Pesquisar veículos
          </StyledButton>
          <StyledButton
            variant="outline"
            className="clear-button"
            onClick={handleClear}
          >
            {isMobile ? "Apagar" : "Apagar"}
          </StyledButton>
        </SearchContainer>
      </Container>
      

      <Container 
        ref={vehiclesRef}
        isSecond 
        style={{ backgroundColor: '#f5f5f5', padding: '50px 20px 40px', width: '100%', maxWidth: '100%' }}
      >
          <Title center>Veículos Disponíveis</Title>
          <VehiclesGrid>
          {handleSort(filteredVehicles).map((vehicle) => (
            <VehicleCard key={vehicle.id}>
                  <VehicleContent>
                    <VehicleName>
                  {vehicle.nome}
                  <Price>{vehicle.preco}</Price>
                    </VehicleName>
                <VehicleImage src={vehicle.imagem} alt={vehicle.nome} />
                <VehicleDetails>
                  <DetailItem>
                    <strong>Modelo:</strong> {vehicle.modelo}
                  </DetailItem>
                  <DetailItem>
                    <strong>Ano:</strong> {vehicle.ano}
                  </DetailItem>
                  <DetailItem>
                    <strong>Quilometragem:</strong> {vehicle.quilometragem}
                  </DetailItem>
                  <DetailItem>
                    <strong>Câmbio:</strong> {vehicle.cambio}
                  </DetailItem>
                  <DetailItem>
                    <strong>Combustível:</strong> {vehicle.combustivel}
                  </DetailItem>
                  <LocationDetail>
                    <LocationIcon src={locationPin} alt="Localização" />
                    {vehicle.localizacao}
                  </LocationDetail>
                </VehicleDetails>
                  <ButtonsContainer>
                  <StyledButton 
                    variant="secondary" 
                    className="vehicle-button"
                    onClick={() => handleConsultClick(vehicle)}
                  >
                    Consultar
                  </StyledButton>
                  <StyledButton 
                    variant="primary" 
                    className="vehicle-button"
                    onClick={() => handleDetailsClick(vehicle)}
                  >
                    Ver detalhes
                  </StyledButton>
                  </ButtonsContainer>
              </VehicleContent>
              </VehicleCard>
            ))}
          </VehiclesGrid>
        </Container>

      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
        vehicle={selectedVehicle}
      />

      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedVehicle}
        onConsultClick={(vehicle) => {
          setIsDetailsModalOpen(false);
          setSelectedVehicle(vehicle);
          setIsPricingModalOpen(true);
        }}
      />
    </>
  );
}