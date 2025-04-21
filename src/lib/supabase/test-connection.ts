import { supabase } from './config';

export const testSupabaseConnection = async () => {
  console.log('=== INICIANDO TESTE DE CONEXÃO COM SUPABASE ===');
  
  try {
    console.log('1. Testando conexão básica...');
    const { data, error } = await supabase.from('dados_usuario').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão básica:', {
        codigo: error.code,
        mensagem: error.message,
        detalhes: error.details
      });
      return false;
    }
    
    console.log('✅ Conexão básica OK');
    console.log('Resposta:', data);

    console.log('\n2. Testando serviço de autenticação...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Erro no serviço de autenticação:', {
        mensagem: authError.message,
        status: authError.status
      });
      return false;
    }
    
    console.log('✅ Serviço de autenticação OK');
    console.log('Sessão:', authData?.session ? 'Ativa' : 'Inativa');

    console.log('\n=== TESTE DE CONEXÃO CONCLUÍDO COM SUCESSO ===');
    return true;
    
  } catch (error) {
    console.error('❌ ERRO CRÍTICO:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return false;
  }
}; 