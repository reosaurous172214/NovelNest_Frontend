import {BrowserRouter} from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { Scroll } from 'lucide-react';
import ScrollToTop from './ScrollUpTo';
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
        <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
