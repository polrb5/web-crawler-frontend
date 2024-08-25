import { jwtDecode, JwtPayload } from 'jwt-decode';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextType {
  isLoading: boolean;
  sessionToken: string | null;
  setSessionToken: Dispatch<SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  sessionToken: null,
  setSessionToken: () => {},
});

interface AuthProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProps) => {
  const [isLoading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) return;

      const decodedToken = jwtDecode<JwtPayload>(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setSessionToken(null);
        return;
      }

      setSessionToken(storedToken);
    };

    checkToken();
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({ sessionToken, isLoading, setSessionToken }),
    [sessionToken, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
