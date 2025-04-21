require('dotenv').config();
const fetch = require('cross-fetch');
global.fetch = fetch;
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('\n=== TESTE DE CONEXÃO COM SUPABASE ===');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente não configuradas');
  console.log('URL:', supabaseUrl ? 'Presente' : 'Ausente');
  console.log('Key:', supabaseAnonKey ? 'Presente' : 'Ausente');
  process.exit(1);
}

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');

console.log('\nInicializando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\nTestando conexão básica...');
    console.log('Tentando acessar tabela dados_usuario...');
    const { data, error } = await supabase.from('dados_usuario').select('count');

    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      console.error('Código:', error.code);
      console.error('Detalhes:', error);
      console.error('Status HTTP:', error.status);
      return;
    }

    console.log('✅ Conexão básica OK');
    console.log('Dados recebidos:', data);

    console.log('\nTestando autenticação...');
    console.log('Verificando sessão atual...');
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message);
      console.error('Código:', authError.code);
      console.error('Detalhes:', authError);
      console.error('Status:', authError.status);
      return;
    }

    console.log('✅ Autenticação OK');
    console.log('Status da sessão:', authData.session ? 'Ativa' : 'Inativa');
    if (authData.session) {
      console.log('Usuário:', authData.session.user.email);
      console.log('Último acesso:', new Date(authData.session.last_sign_in_at).toLocaleString());
    }

  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO NO TESTE');
    console.error('Mensagem:', error.message);
    console.error('Nome:', error.name);
    console.error('Detalhes completos:', error);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
  }
}

console.log('\nIniciando teste de conexão...');
testConnection().then(() => {
  console.log('\n=== TESTE CONCLUÍDO ===');
}); 