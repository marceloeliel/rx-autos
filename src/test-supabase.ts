import { testSupabaseConnection } from './lib/supabase/test-connection';

console.log('Iniciando teste do Supabase...\n');

testSupabaseConnection()
  .then(success => {
    if (!success) {
      console.log('\n❌ Teste falhou. Verifique os erros acima.');
      process.exit(1);
    }
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro ao executar teste:', error);
    process.exit(1);
  }); 