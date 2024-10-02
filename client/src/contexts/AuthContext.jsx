import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      setUser(data?.session?.user ?? null);
    };
    getSession();

    // Escuchar cambios de autenticación
    const { subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    // Limpiar el listener al desmontar el componente
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función para iniciar sesión con GitHub
  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error('Error signing in:', error);
  };

  // Función para cerrar sesión
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setUser(null);
  };

  // Proveer el estado de usuario y las funciones a los hijos del contexto
  return (
    <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);
