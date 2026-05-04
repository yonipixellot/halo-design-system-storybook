import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { SignInScreen } from './screens/auth/SignIn';

const App = () => (
  <div className="glass-app" data-theme="dark" style={{ minHeight: '100vh' }}>
    <div className="phone-screen" style={{ position: 'relative', minHeight: '100vh' }}>
      <SignInScreen dispatch={(a) => console.log('dispatch', a)} />
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
