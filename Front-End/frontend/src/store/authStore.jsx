// authStore.jsx - contextul de autentificare pentru toata aplicatia
// aici tinem userul logat si functiile de login/logout
// folosim React Context pentru a putea accesa userul din orice componenta

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi } from '../api/auth';
import { setToken, removeToken, getToken } from '../utils/token';

// cream contextul - initial e gol
const AuthContext = createContext(null);

// provider-ul care impacheteaza toata aplicatia
export function AuthProvider({ children }) {
  // starea userului - null daca nu e logat
  const [user, setUser] = useState(null);
  // loading = true cat timp verificam daca exista un token salvat
  const [loading, setLoading] = useState(true);

  // cand se incarca aplicatia, verificam daca avem token salvat
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // daca avem token, incercam sa luam datele userului
          const data = await getMe();
          setUser(data.user);
        } catch {
          // daca nu merge (token expirat), stergem token-ul
          removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // functia de login - primeste email si parola, returneaza datele
  const login = async (email, password) => {
    const data = await loginApi(email, password);
    // salvam token-ul in localStorage
    setToken(data.token);
    // punem userul in state
    setUser(data.user);
    return data;
  };

  // functia de logout - stergem token-ul si userul
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // returnam provider-ul cu toate valorile necesare
  return (
    <AuthContext.Provider value={{ 
      user,           // datele userului sau null
      loading,        // true cat timp verificam autentificarea
      isAuthenticated: !!user,  // true daca e logat
      login,          // functia de login
      logout          // functia de logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook custom pentru a accesa contextul - mai usor decat useContext direct
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth trebuie folosit in interiorul AuthProvider');
  }
  return context;
}
