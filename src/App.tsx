import { useAuth } from '@/contexts/AuthContext';
import Routes from './routes';

import './theme/global.scss';

const App = () => {
  const { isLoading } = useAuth();

  return !isLoading && <Routes />;
};

export default App;
