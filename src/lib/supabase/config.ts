import { createClient } from '@supabase/supabase-js';

// Verifica se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não configuradas');
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

console.log('\n=== CONFIGURAÇÃO DO SUPABASE ===');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');

// Função para testar a conexão
const testConnection = async () => {
  try {
    console.log('\nTestando conexão com Supabase...');
    const { data, error } = await supabase.from('dados_usuario').select('count');
    
    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro crítico:', error);
    return false;
  }
};

// Criação do cliente Supabase com configurações básicas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Executa o teste de conexão
testConnection().then(success => {
  if (!success) {
    console.log('\n⚠️ Por favor, verifique:');
    console.log('1. Se a URL do Supabase está correta');
    console.log('2. Se a chave anônima está correta');
    console.log('3. Se há conexão com a internet');
    console.log('4. Se não há bloqueios de firewall\n');
  }
});

// Interface para dados de usuário
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

// Interface para dados de registro
export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

// Interface para dados de login
export interface SignInData {
  email: string;
  password: string;
} 