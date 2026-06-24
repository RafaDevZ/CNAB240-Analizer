import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CnabViewer from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CnabViewer />
  </BrowserRouter>
)
