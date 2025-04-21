import { supabase } from './config';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export const UserService = {
  async getAllUsers(): Promise<{ data: UserData[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('dados_usuario')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return {
          data: null,
          error: 'Erro ao buscar usuários. Por favor, tente novamente.'
        };
      }

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        data: null,
        error: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      };
    }
  },

  async searchUsers(query: string): Promise<{ data: UserData[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('dados_usuario')
        .select('*')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao pesquisar usuários:', error);
        return {
          data: null,
          error: 'Erro ao pesquisar usuários. Por favor, tente novamente.'
        };
      }

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Erro ao pesquisar usuários:', error);
      return {
        data: null,
        error: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      };
    }
  }
}; 