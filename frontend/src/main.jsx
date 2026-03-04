import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AutenticacionProvider } from './context/AutenticacionContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ToastContainer } from './components/ToastContainer.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AutenticacionProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </AutenticacionProvider>
    </BrowserRouter>
  </StrictMode>,
)
