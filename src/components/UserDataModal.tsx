import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RippleButton from './RippleButton';
import { supabase } from '../lib/supabase/config';
import { useAuth } from '../lib/supabase/AuthContext';
import { toast } from 'react-toastify';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';

registerLocale('pt-BR', ptBR);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 0;
    align-items: stretch;
    background-color: white;
  }
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 0;
    max-height: 100vh;
    height: 100%;
    overflow-y: auto;
    box-shadow: none;
    display: flex;
    flex-direction: column;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  padding-top: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    flex: 1;
    padding-bottom: 20px;
  }
`;

const Section = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(6, 1fr);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.span-2 {
    grid-column: span 2;
    @media (max-width: 768px) {
      grid-column: span 3;
    }
  }

  &.span-3 {
    grid-column: span 3;
    @media (max-width: 768px) {
      grid-column: span 6;
    }
  }

  &.span-4 {
    grid-column: span 4;
    @media (max-width: 768px) {
      grid-column: span 6;
    }
  }

  &.span-5 {
    grid-column: span 5;
    @media (max-width: 768px) {
      grid-column: span 6;
    }
  }

  &.span-6 {
    grid-column: span 6;
  }

  &.span-2-66 {
    grid-column: span 2 / span 6;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
  padding: 0 24px;

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px 0;
    margin-top: auto;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StyledRippleButton = styled(RippleButton)`
  min-width: 120px;
  max-width: 180px;

  @media (max-width: 768px) {
    flex: 1;
    max-width: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  grid-column: 1 / -1;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background-color: #ff6b00;
    border-radius: 2px;
  }
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    font-family: inherit;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.2s;
    background-color: white;

    &:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
    }
  }
`;

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface FormData {
  CPF: string;
  Telefone: string;
  DataNascimento: string;
  CEP: string;
  Logradouro: string;
  numero: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
}

interface UserDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

const formatPhone = (value: string) => {
  if (!value) return '';
  
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara conforme vai digitando
  let formattedValue = numbers;
  if (numbers.length > 0) {
    formattedValue = `(${numbers.slice(0, 2)}`;
    if (numbers.length > 2) {
      formattedValue += `)${numbers.slice(2, 3)}`;
      if (numbers.length > 3) {
        formattedValue += ` ${numbers.slice(3, 7)}`;
        if (numbers.length > 7) {
          formattedValue += `-${numbers.slice(7, 11)}`;
        }
      }
    }
  }
  return formattedValue;
};

const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
};

const formatDate = (date: string) => {
  if (!date) return '';
  try {
    const [year, month, day] = date.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

const parseDate = (dateString: string) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export function UserDataModal({ isOpen, onClose }: UserDataModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [existemDados, setExistemDados] = useState(false);
  const [formData, setFormData] = useState({
    CPF: '',
    Telefone: '',
    DataNascimento: '',
    CEP: '',
    Logradouro: '',
    numero: '',
    Bairro: '',
    Cidade: '',
    Estado: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      carregarDadosUsuario();
    }
  }, [isOpen, user]);

  const carregarDadosUsuario = async () => {
    try {
      console.log('Carregando dados do usuário:', user?.id);
      const { data, error } = await supabase
        .from('dados_usuario')
        .select('*')
        .eq('uid', user?.id)
        .single();

      console.log('Dados recebidos:', data);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Formatando a data diretamente do formato do banco
        const dataNascimento = data.DataNascimento ? data.DataNascimento.substring(0, 10) : '';
        const [ano, mes, dia] = dataNascimento.split('-');
        const dataFormatada = dataNascimento ? `${dia}/${mes}/${ano}` : '';

        const dadosFormatados = {
          CPF: formatCPF(data.CPF || ''),
          Telefone: formatPhone(data.Telefone || ''),
          DataNascimento: dataFormatada,
          CEP: formatCEP(data.CEP || ''),
          Logradouro: data.Logradouro || '',
          Estado: data.Estado || '',
          Bairro: data.Bairro || '',
          numero: data.numero || '',
          Cidade: data.Cidade || ''
        };

        console.log('Data formatada:', dataFormatada);
        console.log('Dados formatados:', dadosFormatados);
        setFormData(dadosFormatados);
        setExistemDados(true);
      } else {
        // Resetando o formulário quando não há dados
        setFormData({
          CPF: '',
          Telefone: '',
          DataNascimento: '',
          CEP: '',
          Logradouro: '',
          Estado: '',
          Bairro: '',
          numero: '',
          Cidade: ''
        });
        setExistemDados(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados. Tente novamente.');
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.CEP.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            Logradouro: data.logradouro || '',
            Bairro: data.bairro || '',
            Cidade: data.localidade || '',
            Estado: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar CEP. Tente novamente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let cursorPosition = e.target.selectionStart || 0;
    const previousValue = formData[name as keyof FormData];
    const previousLength = previousValue.length;

    if (name === 'Telefone') {
      formattedValue = formatPhone(value);
      // Ajusta o cursor para telefone (99)9 9999-9999
      if (formattedValue.length < previousLength) {
        cursorPosition = cursorPosition - 1;
      } else if (formattedValue.length > previousLength) {
        // Adiciona posição extra após os caracteres especiais
        if (cursorPosition === 3) cursorPosition += 1; // Após (
        if (cursorPosition === 6) cursorPosition += 1; // Após )
        if (cursorPosition === 7) cursorPosition += 1; // Após espaço
        if (cursorPosition === 12) cursorPosition += 1; // Após -
      }
    } else if (name === 'CPF') {
      formattedValue = formatCPF(value);
    } else if (name === 'CEP') {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Ajusta a posição do cursor após a formatação
    setTimeout(() => {
      const input = e.target;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setFormData(prev => ({ ...prev, DataNascimento: '' }));
      return;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    setFormData(prev => ({
      ...prev,
      DataNascimento: `${day}/${month}/${year}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convertendo a data para o formato do banco (yyyy-mm-dd)
      const [day, month, year] = formData.DataNascimento.split('/');
      const formattedDate = `${year}-${month}-${day}`;

      const dadosParaSalvar = {
        uid: user?.id,
        CPF: formData.CPF,
        Telefone: formData.Telefone,
        DataNascimento: formattedDate,
        CEP: formData.CEP,
        Logradouro: formData.Logradouro,
        numero: formData.numero,
        Bairro: formData.Bairro,
        Cidade: formData.Cidade,
        Estado: formData.Estado
      };

      console.log('Dados para salvar:', dadosParaSalvar);

      if (existemDados) {
        const { error: updateError } = await supabase
          .from('dados_usuario')
          .update(dadosParaSalvar)
          .eq('uid', user?.id);

        if (updateError) {
          console.error('Erro na atualização:', updateError);
          throw new Error(updateError.message);
        }

        toast.success('Dados atualizados com sucesso!');
      } else {
        const { error: insertError } = await supabase
          .from('dados_usuario')
          .insert(dadosParaSalvar);

        if (insertError) {
          console.error('Erro na inserção:', insertError);
          throw new Error(insertError.message);
        }

        toast.success('Dados salvos com sucesso!');
      }

      await carregarDadosUsuario();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar dados:', error);
      toast.error(`Erro ao salvar os dados: ${error.message || 'Tente novamente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{existemDados ? 'Editar Dados do Perfil' : 'Cadastrar Dados do Perfil'}</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <InputGroup className="span-4">
              <Label>CPF</Label>
              <Input
                type="text"
                name="CPF"
                value={formData.CPF}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </InputGroup>

            <InputGroup className="span-4">
              <Label>Telefone</Label>
              <Input
                type="text"
                name="Telefone"
                value={formData.Telefone}
                onChange={handleChange}
                placeholder="(00) 9 9999-9999"
                required
              />
            </InputGroup>

            <InputGroup className="span-4">
              <Label>Data de Nascimento</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={formData.DataNascimento ? parseDate(formData.DataNascimento) : null}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  placeholderText="DD/MM/AAAA"
                  required
                  maxDate={new Date()}
                />
              </DatePickerWrapper>
            </InputGroup>
          </Section>

          <Section>
            <SectionTitle>Endereço</SectionTitle>
            <InputGroup className="span-2">
              <Label>CEP</Label>
              <Input
                type="text"
                name="CEP"
                value={formData.CEP}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                required
              />
            </InputGroup>

            <InputGroup className="span-5">
              <Label>Logradouro</Label>
              <Input
                type="text"
                name="Logradouro"
                value={formData.Logradouro}
                onChange={handleChange}
                placeholder="Digite seu endereço"
                required
              />
            </InputGroup>

            <InputGroup className="span-2">
              <Label>Número</Label>
              <Input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Digite o número"
                required
              />
            </InputGroup>

            <InputGroup className="span-3">
              <Label>Bairro</Label>
              <Input
                type="text"
                name="Bairro"
                value={formData.Bairro}
                onChange={handleChange}
                placeholder="Digite seu bairro"
                required
              />
            </InputGroup>

            <InputGroup className="span-5">
              <Label>Cidade</Label>
              <Input
                type="text"
                name="Cidade"
                value={formData.Cidade}
                onChange={handleChange}
                placeholder="Digite sua cidade"
                required
              />
            </InputGroup>

            <InputGroup className="span-2">
              <Label>Estado</Label>
              <Input
                type="text"
                name="Estado"
                value={formData.Estado}
                onChange={handleChange}
                placeholder="Digite seu estado"
                required
              />
            </InputGroup>
          </Section>

          <ButtonsContainer>
            <StyledRippleButton
              onClick={handleCancel}
              disabled={isLoading}
              variant="secondary"
            >
              Cancelar
            </StyledRippleButton>
            <StyledRippleButton
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? "Salvando..." : existemDados ? "Atualizar" : "Cadastrar"}
            </StyledRippleButton>
          </ButtonsContainer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 