import { createContext, useContext, useState, useEffect } from 'react';
import { appParams } from './app-params';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing token/session
    const token = appParams.token;
    if (token) {
      // Validate token if needed
      setUser({ token });
    }
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  }, []);

  const navigateToLogin = () => {
    // Redirect to Base44 login
    const appId = appParams.appId;
    const currentUrl = window.location.href;
    if (appId) {
      window.location.href = `https://base44.com/auth?app_id=${appId}&redirect_uri=${encodeURIComponent(currentUrl)}`;
    }
  };

  const value = {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    user,
    navigateToLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}