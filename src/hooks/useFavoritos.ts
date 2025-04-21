import { useState, useEffect } from 'react';

export interface Veiculo {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  ano: string;
  preco: number;
  imagem: string;
  localizacao: string;
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Veiculo[]>([]);

  useEffect(() => {
    const storedFavoritos = localStorage.getItem('favoritos');
    if (storedFavoritos) {
      setFavoritos(JSON.parse(storedFavoritos));
    }
  }, []);

  const addFavorito = (veiculo: Veiculo) => {
    const novosFavoritos = [...favoritos, veiculo];
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
  };

  const removeFavorito = (id: string) => {
    const novosFavoritos = favoritos.filter(fav => fav.id !== id);
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
  };

  const isFavorito = (id: string) => {
    return favoritos.some(fav => fav.id === id);
  };

  return {
    favoritos,
    addFavorito,
    removeFavorito,
    isFavorito
  };
} 