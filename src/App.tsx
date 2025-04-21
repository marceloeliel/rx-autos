import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import InstallPWAPrompt from './components/InstallPWAPrompt';
import { AuthProvider, useAuth } from './lib/supabase/AuthContext';
import UserProfile from './components/UserProfile';
import { UserDataModal } from './components/UserDataModal';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();
  const [isUserDataModalOpen, setIsUserDataModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [favoritos, setFavoritos] = useState<Array<{
    id: string;
    nome: string;
    preco: string;
    ano: string;
    quilometragem: string;
    imagem: string;
  }>>([]);

  const handleRemoveFavorito = (id: string) => {
    setFavoritos(prev => prev.filter(fav => fav.id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/perfil" 
        element={
          <PrivateRoute>
            <UserProfile 
              onEditProfile={() => setIsUserDataModalOpen(true)}
              onChangePassword={() => setIsChangePasswordModalOpen(true)}
              favoritos={favoritos}
              onRemoveFavorito={handleRemoveFavorito}
            />
            <UserDataModal
              isOpen={isUserDataModalOpen}
              onClose={() => setIsUserDataModalOpen(false)}
            />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
        <InstallPWAPrompt />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </Router>
  );
}
