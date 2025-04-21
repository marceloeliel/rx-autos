import { User } from '@supabase/supabase-js';
import { supabase } from './config';

interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

interface UserData {
  email: string;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 segundo

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const translateError = (error: any): string => {
  console.log('Detalhes do erro:', error);
  
  if (!error) return 'Erro desconhecido';
  
  if (error.message === 'Failed to fetch' || error.message?.includes('fetch')) {
    return 'Não foi possível conectar ao servidor. Por favor, tente novamente.';
  }
  
  if (error.message?.toLowerCase().includes('email') || 
      error.message?.toLowerCase().includes('already registered')) {
    return 'Este email já está cadastrado. Por favor, faça login ou use outro email.';
  }
  
  if (error.message?.includes('network') || error.message?.includes('connection')) {
    return 'Problema de conexão detectado. Por favor, verifique sua internet.';
  }
  
  return error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.log(`Tentativa falhou. Restantes: ${retries}`, error);
    if (retries > 0) {
      await wait(RETRY_DELAY);
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
};

export const AuthService = {
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      console.log('Verificando se email existe:', email);
      const { count, error } = await supabase
        .from('dados_usuario')
        .select('*', { count: 'exact', head: true })
        .eq('email', email);

      if (error) {
        console.error('Erro ao verificar email:', error);
        return false;
      }

      console.log('Resultado da verificação de email:', { count });
      return count ? count > 0 : false;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  },

  async signUp({ email, password, ...metadata }: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('Iniciando processo de registro...');
      
      // Verifica se o email já existe
      console.log('Verificando email:', email);
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        console.log('Email já cadastrado');
        return {
          user: null,
          error: 'Este email já está cadastrado. Por favor, faça login ou use outro email.'
        };
      }

      console.log('Realizando registro no Supabase...');
      const { data, error } = await retryOperation(() => 
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
            emailRedirectTo: window.location.origin
          }
        })
      );

      if (error) {
        console.error('Erro no registro Supabase:', error);
        return {
          user: null,
          error: translateError(error)
        };
      }

      console.log('Registro concluído com sucesso:', data.user);
      return {
        user: data.user,
        error: null
      };
    } catch (error) {
      console.error('Erro crítico no cadastro:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
      return {
        user: null,
        error: translateError(error)
      };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('Iniciando processo de login...');
      const { data, error } = await retryOperation(() =>
        supabase.auth.signInWithPassword({
          email,
          password
        })
      );

      if (error) {
        console.error('Erro no login:', error);
        return {
          user: null,
          error: translateError(error)
        };
      }

      console.log('Login realizado com sucesso:', data.user);
      return {
        user: data.user,
        error: null
      };
    } catch (error) {
      console.error('Erro crítico no login:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
      return {
        user: null,
        error: translateError(error)
      };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      console.log('Iniciando processo de logout...');
      const { error } = await retryOperation(() => supabase.auth.signOut());
      if (error) throw error;
      console.log('Logout realizado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('Erro no logout:', error);
      return {
        error: translateError(error)
      };
    }
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      console.log('Iniciando processo de reset de senha...');
      const { error } = await retryOperation(() => 
        supabase.auth.resetPasswordForEmail(email)
      );
      if (error) throw error;
      console.log('Email de reset enviado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return {
        error: translateError(error)
      };
    }
  },

  async getCurrentUser() {
    try {
      console.log('Buscando usuário atual...');
      const { data: { user }, error } = await retryOperation(() => 
        supabase.auth.getUser()
      );
      if (error) throw error;
      console.log('Usuário atual:', user);
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }
};
