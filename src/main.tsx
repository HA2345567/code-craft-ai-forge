import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AIEngineProvider } from './hooks/use-ai-engine'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AIEngineProvider>
      <App />
    </AIEngineProvider>
  </React.StrictMode>,
)
