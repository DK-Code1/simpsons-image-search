import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Home } from './pages/Home.jsx'
import { QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { LanguageProvider } from './components/Languages.jsx'

const theclient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={theclient}>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>

)
